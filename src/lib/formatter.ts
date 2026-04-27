/* =======================
 * FORMAT UANG (RUPIAH)
 * ======================= */
export function formatRupiah(
  value: number | string,
  options?: {
    withSymbol?: boolean;
    minimumFractionDigits?: number;
  },
) {
  const number = Number(value) || 0;

  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
  }).format(number);

  return options?.withSymbol === false ? formatted : `Rp ${formatted}`;
}

/* =======================
 * FORMAT TANGGAL (dd MMM yyyy)
 * ======================= */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

/* =======================
 * FORMAT TANGGAL + JAM
 * ======================= */
export function formatDateTime(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(new Date(date));
}

/* =======================
 * WAKTU RELATIF
 * ======================= */

export function timeAgoFormat(date: string | Date) {
  const now = new Date().getTime();
  const past = new Date(date).getTime();
  const diff = now - past;

  if (diff < 0) return formatDate(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) {
    return `${seconds} detik yang lalu`;
  }

  if (minutes < 60) {
    return `${minutes} menit yang lalu`;
  }

  if (hours < 24) {
    return `${hours} jam yang lalu`;
  }

  if (days < 7) {
    return `${days} hari yang lalu`;
  }

  if (weeks <= 4) {
    return `${weeks} minggu yang lalu`;
  }

  // > 4 minggu → tanggal normal
  return formatDate(date);
}

/* =======================
 * INITIAL NAMA
 * ======================= */
export function getInitialName(name: string) {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/* =======================
 * FORMAT NUMBER
 * ======================= */
export function formatNumber(value: number | string) {
  const numStr = value.toString().replace(/\D/g, "");
  if (!numStr) return "";
  return parseInt(numStr).toLocaleString("id-ID");
}

/* =======================
 * FORMAT NUMBER SINGKAT (1.2 rb, 3.4 jt, dst)
 * ======================= */

export function fmt(n: number): string {
  if (n >= 1_000_000_000)
    return `${(n / 1_000_000_000).toFixed(1).replace(".0", "")} M`;
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(".0", "")} jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} rb`;
  return n.toLocaleString("id-ID");
}
