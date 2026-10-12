export type Channel =
  | "paid" | "organic_search" | "social" | "email" | "referral" | "direct";

export interface Touch {
  source: string;
  medium: string;
  channel: Channel;
  campaign?: string;
  content?: string;
  term?: string;
  click_id?: string;
  click_id_type?: string;
  referrer_host?: string;
  attribution_params?: Record<string, string>;
  landing_path: string;
  ts: number;
}

const LAST_COOKIE = "utm_params";
const FIRST_COOKIE = "attr_first";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 hari
const SESSION_TOUCH = "attr_session"; // cara masuk pada kunjungan (tab) ini

const CLICK_IDS: Record<string, string> = {
  gclid: "google",
  ttclid: "tiktok",
  msclkid: "bing",
  fbclid: "meta",
};

const PAID_MEDIUM = /^(cpc|ppc|paid|paid[_-]?social|ads?|cpm|display)$/;

const REFERRER_MAP: Array<[RegExp, string, Channel]> = [
  [/(^|\.)google\.[a-z.]+$/, "google", "organic_search"],
  [/(^|\.)bing\.com$/, "bing", "organic_search"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo", "organic_search"],
  [/(^|\.)yahoo\.com$/, "yahoo", "organic_search"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "facebook", "social"],
  [/(^|\.)instagram\.com$/, "instagram", "social"],
  [/^t\.co$|(^|\.)(twitter|x)\.com$/, "twitter", "social"],
  [/(^|\.)tiktok\.com$/, "tiktok", "social"],
  [/(^|\.)youtube\.com$/, "youtube", "social"],
  [/(^|\.)linkedin\.com$/, "linkedin", "social"],
  [/(^|\.)whatsapp\.com$/, "whatsapp", "social"],
];

const ANDROID_APPS: Record<string, [string, Channel]> = {
  "com.google.android.googlequicksearchbox": ["google", "organic_search"],
  "com.instagram.android": ["instagram", "social"],
  "com.facebook.katana": ["facebook", "social"],
  "com.whatsapp": ["whatsapp", "social"],
  "com.twitter.android": ["twitter", "social"],
  "com.zhiliaoapp.musically": ["tiktok", "social"],
};

const stripWww = (h: string) => h.replace(/^www\./, "");

function readCookie(name: string): Touch | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[1]));
  } catch {
    return null;
  }
}

function writeCookie(name: string, touch: Touch) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${name}=${encodeURIComponent(JSON.stringify(touch))}` +
    `; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
}

function inAppSource(): string | null {
  const ua = navigator.userAgent;
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "facebook";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "tiktok";
  return null;
}

function channelFromMedium(medium: string): Channel {
  if (PAID_MEDIUM.test(medium)) return "paid";
  if (/^e-?mail$/.test(medium)) return "email";
  if (/^(social|sm)/.test(medium)) return "social";
  if (/^(organic|seo)/.test(medium)) return "organic_search";
  return "referral";
}

function getAttributionParams(params: URLSearchParams): Record<string, string> {
  const attributionParams: Record<string, string> = {};
  params.forEach((value, key) => {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.startsWith("utm_") ||
      Object.prototype.hasOwnProperty.call(CLICK_IDS, normalizedKey) ||
      /^(gad_|gclid$|dclid$|gbraid$|wbraid$|li_fat_id$|twclid$)/.test(
        normalizedKey,
      )
    ) {
      attributionParams[normalizedKey] = value.slice(0, 500);
    }
  });
  return attributionParams;
}

function buildTouch(params: URLSearchParams): Touch {
  const get = (k: string) =>
    params.get(k)?.trim().toLowerCase().slice(0, 100) || undefined;

  const base = {
    attribution_params: getAttributionParams(params),
    campaign: get("utm_campaign"),
    content: get("utm_content"),
    term: get("utm_term"),
    landing_path: location.pathname,
    ts: Date.now(),
  };

  const clickKey = Object.keys(CLICK_IDS).find((k) => params.has(k));
  const click = clickKey
    ? { click_id_type: clickKey, click_id: params.get(clickKey)!.slice(0, 150) }
    : {};

  // 1) UTM (prioritas tertinggi)
  const utmSource = get("utm_source");
  if (utmSource) {
    const medium = get("utm_medium") ?? "unknown";
    return { ...base, ...click, source: utmSource, medium, channel: channelFromMedium(medium) };
  }

  // 2) Click ID (fbclid tidak otomatis dianggap paid)
  if (clickKey) {
    const source = CLICK_IDS[clickKey];
    const paid = clickKey !== "fbclid";
    return {
      ...base, ...click, source,
      medium: paid ? "cpc" : "social",
      channel: paid ? "paid" : "social",
    };
  }

  // 3) Referrer
  let host = "";
  let androidPkg = "";
  if (document.referrer) {
    try {
      const u = new URL(document.referrer);
      if (u.protocol === "android-app:") androidPkg = u.hostname;
      else host = stripWww(u.hostname);
    } catch { }
  }

  if (androidPkg && ANDROID_APPS[androidPkg]) {
    const [source, channel] = ANDROID_APPS[androidPkg];
    return { ...base, source, medium: "app", channel };
  }

  const own = stripWww(location.hostname);
  const isInternal = !!host && (host === own || host.endsWith("." + own));
  if (host && !isInternal) {
    for (const [re, source, channel] of REFERRER_MAP) {
      if (re.test(host)) {
        return { ...base, source, medium: "referral", channel, referrer_host: host };
      }
    }
    return { ...base, source: host, medium: "referral", channel: "referral", referrer_host: host };
  }

  // 4) In-app browser tanpa referrer
  const app = inAppSource();
  if (app && !isInternal) {
    return { ...base, source: app, medium: "inapp", channel: "social" };
  }

  // 5) Direct
  return { ...base, source: "direct", medium: "none", channel: "direct" };
}

export function initAttribution() {
  const params = new URLSearchParams(location.search);
  const hasCampaignSignal =
    ["utm_source", ...Object.keys(CLICK_IDS)].some((k) => params.has(k));

  // Kunjungan (tab) dianggap sudah dievaluasi hanya kalau touch-nya benar-benar tersimpan
  let firstOfSession = true;
  try {
    firstOfSession = !sessionStorage.getItem(SESSION_TOUCH);
  } catch { }

  // Navigasi internal biasa: jangan evaluasi ulang
  if (!hasCampaignSignal && !firstOfSession) return;

  const touch = buildTouch(params);

  // Cara masuk pada kunjungan (tab) ini. Boleh "direct".
  try {
    sessionStorage.setItem(SESSION_TOUCH, JSON.stringify(touch));
  } catch { }

  const first = readCookie(FIRST_COOKIE);
  const last = readCookie(LAST_COOKIE);

  if (touch.channel === "direct") {
    // direct tidak boleh menimpa sumber yang sudah ada
    if (!first) writeCookie(FIRST_COOKIE, touch);
    if (!last) writeCookie(LAST_COOKIE, touch);
    return;
  }

  writeCookie(LAST_COOKIE, touch);
  if (!first || first.channel === "direct") writeCookie(FIRST_COOKIE, touch);

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: "traffic_source", ...touch });
}

// ── Dipakai saat submit transaksi ───────────────────────────────────────────
function readSessionTouch(): Touch | null {
  try {
    const raw = sessionStorage.getItem(SESSION_TOUCH);
    return raw ? (JSON.parse(raw) as Touch) : null;
  } catch {
    return null;
  }
}

function addTouchFields(
  out: Record<string, string>,
  prefix: string,
  t: Touch | null,
) {
  if (!t) return;
  const fields: Array<[string, string | undefined]> = [
    ["source", t.source],
    ["medium", t.medium],
    ["channel", t.channel],
    ["campaign", t.campaign],
    ["content", t.content],
    ["term", t.term],
    ["referrer_host", t.referrer_host],
    ["landing_path", t.landing_path],
  ];
  for (const [key, value] of fields) {
    if (value) out[`${prefix}${key}`] = value;
  }
}

export function getAttribution(): { source: string; parameter_detail: string } {
  if (typeof window === "undefined") {
    return { source: "direct", parameter_detail: "" };
  }

  const first = readCookie(FIRST_COOKIE); // pertama kali datang (cookie)

  // Cara masuk pada kunjungan ini. Kalau datanya tidak ada, anggap direct.
  const visit: Touch =
    readSessionTouch() ?? {
      source: "direct",
      medium: "none",
      channel: "direct",
      landing_path: location.pathname,
      ts: Date.now(),
    };

  const source = visit.source || "direct";

  const detail: Record<string, string> = {
    // parameter mentah kunjungan ini (utm_*, gclid, fbclid, dst)
    ...(visit.attribution_params ?? {}),
  };
  addTouchFields(detail, "visit_", visit);
  addTouchFields(detail, "first_", first);

  return {
    source,
    parameter_detail: JSON.stringify(detail),
  };
}