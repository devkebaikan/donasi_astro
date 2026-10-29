import { getToken, isLoggedIn, bearerHeaders } from "@/lib/auth";

const USER_REFF_KEY = "user_reff_code";
const INCOMING_REFF_KEY = "incoming_reff_code";
const COOKIE_REFF_KEY = "reff_code";
const INCOMING_LEADS_KEY = "incoming_leads";
const COOKIE_LEADS_KEY = "leads";
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
const TWELVE_HOURS_SEC = 12 * 60 * 60; // 43200 detik

interface StoredIncomingReff {
  code: string;
  expiresAt: number;
}

// ── User's Own Referral Code (Untuk Share) ─────────────────────────────────

/**
 * Mengambil reff_code milik user yang sedang login.
 * Mengutamakan dari localStorage. Jika belum ada di local, fetch dari my-account dan simpan.
 * Mengembalikan null jika user belum login atau tidak memiliki reff_code.
 */
export async function getUserReffCode(): Promise<string | null> {
  if (typeof window === "undefined" || !isLoggedIn()) return null;

  try {
    const cached = localStorage.getItem(USER_REFF_KEY);
    if (cached && cached.trim() !== "") {
      return cached.trim();
    }

    const token = getToken();
    if (!token) return null;

    const res = await fetch(`/api/dashboard/donatur/my-account`, {
      headers: bearerHeaders(token),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const reffCode = json?.data?.reff_code;

    if (reffCode && typeof reffCode === "string" && reffCode.trim() !== "") {
      const code = reffCode.trim();
      localStorage.setItem(USER_REFF_KEY, code);
      return code;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Menyimpan / memperbarui user reff_code ke localStorage.
 */
export function setUserReffCode(code: string): void {
  if (typeof window === "undefined") return;
  if (code && code.trim() !== "") {
    localStorage.setItem(USER_REFF_KEY, code.trim());
  } else {
    localStorage.removeItem(USER_REFF_KEY);
  }
}

/**
 * Menghapus user reff_code dari localStorage (dipanggil saat logout).
 */
export function clearUserReffCode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_REFF_KEY);
  // Bersihkan juga legacy key jika ada
  localStorage.removeItem("save_reff_code");
}

/**
 * Menambahkan reff_code user yang sedang login (jika ada) ke URL tujuan share.
 */
export async function appendReffCodeToUrl(targetUrl?: string | URL): Promise<string> {
  if (typeof window === "undefined") return targetUrl ? targetUrl.toString() : "";

  const base = targetUrl ? targetUrl.toString() : window.location.href;
  const urlObj = new URL(base, window.location.origin);

  const userReff = await getUserReffCode();
  if (userReff) {
    urlObj.searchParams.set("reff_code", userReff);
  }

  return urlObj.toString();
}

// ── Incoming Referral Code (Tamu / Pengunjung dari link referral orang lain) ─

/**
 * Menyimpan incoming reff_code dengan masa berlaku 12 jam.
 * Tersimpan di localStorage dan document.cookie agar sinkron client & server.
 */
export function saveIncomingReffCode(code: string): void {
  if (typeof window === "undefined" || !code || code.trim() === "") return;

  const cleanCode = code.trim();
  const item: StoredIncomingReff = {
    code: cleanCode,
    expiresAt: Date.now() + TWELVE_HOURS_MS,
  };

  try {
    localStorage.setItem(INCOMING_REFF_KEY, JSON.stringify(item));
  } catch {
    // ignore storage error
  }

  try {
    // Simpan ke cookie dengan max-age 12 jam (43200 detik)
    document.cookie = `${COOKIE_REFF_KEY}=${encodeURIComponent(cleanCode)}; path=/; max-age=${TWELVE_HOURS_SEC}; SameSite=Lax`;
  } catch {
    // ignore cookie error
  }
}

/**
 * Mengambil incoming reff_code jika masih dalam masa berlaku (< 12 jam).
 * Jika sudah expired, otomatis dibersihkan dan mengembalikan null.
 */
export function getIncomingReffCode(): string | null {
  if (typeof window === "undefined") return null;

  try {
    // 1. Coba ambil dari localStorage
    const raw = localStorage.getItem(INCOMING_REFF_KEY);
    if (raw) {
      const parsed: StoredIncomingReff = JSON.parse(raw);
      if (parsed && parsed.code && parsed.expiresAt) {
        if (Date.now() > parsed.expiresAt) {
          clearIncomingReffCode();
          return null;
        }
        return parsed.code;
      }
    }

    // 2. Fallback: coba baca dari Cookie
    const match = document.cookie.match(new RegExp(`(^|;\\s*)${COOKIE_REFF_KEY}=([^;]+)`));
    if (match && match[2]) {
      const code = decodeURIComponent(match[2]).trim();
      if (code) return code;
    }

    return null;
  } catch {
    clearIncomingReffCode();
    return null;
  }
}

/**
 * Menghapus incoming reff_code dari localStorage dan cookie.
 */
export function clearIncomingReffCode(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(INCOMING_REFF_KEY);
  } catch {}

  try {
    document.cookie = `${COOKIE_REFF_KEY}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } catch {}
}

// ── Incoming Leads Tracker ───────────────────────────────────────────────────

/**
 * Menyimpan incoming leads dengan masa berlaku 12 jam.
 * Tersimpan di localStorage dan document.cookie agar sinkron client & server.
 */
export function saveIncomingLeads(leads: string): void {
  if (typeof window === "undefined" || !leads || leads.trim() === "") return;

  const cleanLeads = leads.trim();
  const item: StoredIncomingReff = {
    code: cleanLeads,
    expiresAt: Date.now() + TWELVE_HOURS_MS,
  };

  try {
    localStorage.setItem(INCOMING_LEADS_KEY, JSON.stringify(item));
    // Simpan juga key legacy 'leads' untuk kompatibilitas
    localStorage.setItem("leads", cleanLeads);
  } catch {
    // ignore storage error
  }

  try {
    document.cookie = `${COOKIE_LEADS_KEY}=${encodeURIComponent(cleanLeads)}; path=/; max-age=${TWELVE_HOURS_SEC}; SameSite=Lax`;
  } catch {
    // ignore cookie error
  }
}

/**
 * Mengambil incoming leads jika masih dalam masa berlaku (< 12 jam).
 */
export function getIncomingLeads(): string | null {
  if (typeof window === "undefined") return null;

  try {
    // 1. Coba ambil dari localStorage structured
    const raw = localStorage.getItem(INCOMING_LEADS_KEY);
    if (raw) {
      const parsed: StoredIncomingReff = JSON.parse(raw);
      if (parsed && parsed.code && parsed.expiresAt) {
        if (Date.now() > parsed.expiresAt) {
          clearIncomingLeads();
          return null;
        }
        return parsed.code;
      }
    }

    // 2. Fallback: coba baca dari Cookie
    const match = document.cookie.match(new RegExp(`(^|;\\s*)${COOKIE_LEADS_KEY}=([^;]+)`));
    if (match && match[2]) {
      const val = decodeURIComponent(match[2]).trim();
      if (val) return val;
    }

    // 3. Fallback: coba baca legacy localStorage "leads"
    const legacy = localStorage.getItem("leads");
    if (legacy && legacy.trim() !== "") {
      return legacy.trim();
    }

    return null;
  } catch {
    clearIncomingLeads();
    return null;
  }
}

/**
 * Menghapus incoming leads dari localStorage dan cookie.
 */
export function clearIncomingLeads(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(INCOMING_LEADS_KEY);
    localStorage.removeItem("leads");
  } catch {}

  try {
    document.cookie = `${COOKIE_LEADS_KEY}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } catch {}
}

/**
 * Menginisialisasi pelacakan referral code & leads dari parameter URL.
 * Jalankan ini di layout atau halaman utama.
 */
export function initIncomingReffTracker(): void {
  if (typeof window === "undefined") return;

  try {
    const params = new URLSearchParams(window.location.search);
    const incomingCode = params.get("reff_code") || params.get("ref");
    if (incomingCode && incomingCode.trim() !== "") {
      saveIncomingReffCode(incomingCode.trim());
    }

    const incomingLeads = params.get("leads");
    if (incomingLeads && incomingLeads.trim() !== "") {
      saveIncomingLeads(incomingLeads.trim());
    }
  } catch {
    // ignore URL parsing error
  }
}
