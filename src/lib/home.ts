import { publicApi } from "./api";

// ── Shape types ───────────────────────────────────────────────────────────────

export interface BannerSlide {
  image_url: string;
  link: string;
  is_new_tab: boolean;
}

export interface BannerItem {
  name: string;
  image_url: string;
  link: string;
}

export interface ProgramCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  image_url: string;
  is_utama: string;
  is_active: string;
}

export interface ProgramMitra {
  id: number;
  name: string;
  image: string | null;
  location: string;
}

export interface Program {
  id: number;
  title: string;
  link: string;
  image: string;
  time_target: string | null;
  nominal_target: number;
  nominal_achieved: string | number;
  progress_achieved: string | number;
  remaining_days: number | null;
  mitra: ProgramMitra;
  category: { id: number; name: string; slug: string; image: string };
  tipe: { id: number; name: string; slug: string; description: string };
}

export interface ProjectItem {
  id: number;
  title: string;
  nominal_target: number;
  nominal_achieved: number;
  nominal_used: number;
  excecution_time: string;
  image: string;
  beneficiary: string;
  location: string;
  status: string;
  activity: string;
  mitra: ProgramMitra;
  description: string;
  reason: string;
}

export interface LastUpdate {
  id: number;
  feed_type: string;
  title: string;
  content: string;
  image: string;
  date: string;
  date_string: string;
}

export interface HomeData {
  banner_slides: BannerSlide[];
  main_banner: BannerItem;
  second_banner: BannerItem;
  third_banner: BannerItem;
  program_category: ProgramCategory[];
  program_list: Program[];
  project_list: ProjectItem[];
  last_update: LastUpdate[];
}

// ── Image URL helpers ─────────────────────────────────────────────────────────

const _storageBase = (
  (import.meta.env.PUBLIC_STORAGE_URL as string | undefined) ?? ""
).replace(/\/$/, "");

/**
 * Builds a full image URL from an API filename.
 * - If already absolute (http/https): returns as-is.
 * - Otherwise: prepends PUBLIC_STORAGE_URL/storage/{folder}/.
 */
export function storageImg(filename: string, folder = ""): string {
  if (!filename) return "";
  if (/^https?:\/\//.test(filename)) return filename;
  if (!_storageBase) return filename;
  const dir = folder ? `/${folder}` : "";
  return `${_storageBase}/storage${dir}/${filename}`;
}

/**
 * Resolves a banner link:
 * - "No Link" → "#"
 * - Absolute URL → as-is
 * - Slug → /donasi/{slug}
 */
export function bannerHref(link: string): string {
  if (!link || link === "No Link") return "#";
  return /^https?:\/\//.test(link) ? link : `/donasi/${link}`;
}

/** Strips HTML tags and normalises whitespace. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
