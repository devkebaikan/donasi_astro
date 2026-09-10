import type { AxiosResponse } from "axios";
import { publicApi, serverApi } from "./api";
import type { HomeData } from "./home";

// ── Generic wrapper: returns null on error instead of throwing ────────────────
// Non-generic dengan AxiosResponse eksplisit — hindari T={} inference issue
async function safe(
  fn: () => Promise<AxiosResponse<any>>,
  label: string,
): Promise<any> {
  try {
    const { data } = await fn();
    return data?.data;
  } catch (error) {
    console.error(`[API] ${label}:`, error);
    return null;
  }
}

// ── Home ──────────────────────────────────────────────────────────────

export async function getHomeData(): Promise<HomeData | null> {
  return safe(() => publicApi.get("/pages/home"), "getHomeData");
}

// ── programs ──────────────────────────────────────────────────────────────

export interface CampaignParams {
  limit?: number;
  mode?: string;
  page?: number;
  category?: string | null;
  search?: string | null;
}

export async function getAllCampaigns(params: CampaignParams = {}) {
  // Strip null/undefined/empty to keep query string clean
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null && v !== ""),
  );
  return safe(
    () => publicApi.get("/programs", { params: filtered }),
    "getAllCampaigns",
  );
}

export async function getCampaignByLink(link: string) {
  const { data } = await publicApi.get(`/programs/link/${link}`);
  return data;
}

export async function getCampaignRamadhan() {
  return safe(
    () => publicApi.get("/program-show/ramadhan"),
    "getCampaignRamadhan",
  );
}

// program theme
export async function getProgramThemeBySlug(slug: string) {
  return safe(
    () => publicApi.get(`/program-themes/slug/${slug}`),
    "getProgramThemeBySlug",
  );
}

export async function getCampaignCategories() {
  return safe(
    () => publicApi.get("/program-categories"),
    "getCampaignCategories",
  );
}
export async function getCampaignDonorInfak(params: any) {
  return safe(
    () => publicApi.get("/programs/link/infaq/donors", { params }),
    "getCampaignCategories",
  );
}

export async function getCampaignShow(type: string) {
  return safe(() => publicApi.get(`/program-show/${type}`), "getCampaignShow");
}

export async function getReportByLink(link: string) {
  return safe(
    () =>
      publicApi.get("/report", { params: { program_link: link, limit: 1 } }),
    "getReportByLink",
  );
}

export async function getDonorsByLink(link: string) {
  return safe(
    () =>
      publicApi.get(`/programs/link/${link}/donors`, {
        params: { limit: 5, mode: "pagination", page: 1 },
      }),
    "getDonorsByLink",
  );
}

export async function getDonorsList(limit: number) {
  return safe(
    () => publicApi.get(`/donors/list?limit=${limit}`),
    "getDonorsList",
  );
}
export async function getNominalOptions(link: string) {
  return safe(
    () =>
      publicApi.get("/payment/nominal-option", {
        params: { program_link: link },
      }),
    "getNominalOptions",
  );
}

export async function getAllReportByLink(link: string | null) {
  return safe(
    () => publicApi.get("/report", { params: { program_link: link } }),
    "getAllReportByLink",
  );
}

export async function getProjectByLink(link: string | null) {
  return safe(
    () => publicApi.get("/projects", { params: { program_link: link } }),
    "getProjectByLink",
  );
}

// by id
export async function getProjectById(id: number | null) {
  return safe(() => publicApi.get(`/program/projects/${id}`), "getProjectBId");
}

export async function getProjectSummaryByLink(link: string | null) {
  return safe(
    () =>
      publicApi.get("/projects/summary", { params: { program_link: link } }),
    "getProjectSummaryByLink",
  );
}

export async function getMitraSalurByLink(link: string | null) {
  return safe(
    () =>
      publicApi.get("/programs/mitra-salur", {
        params: { program_link: link },
      }),
    "getMitraSalurByLink",
  );
}

export async function getCampaignSetUp(type: string) {
  return safe(
    () => publicApi.get(`/program-setup/${type}`),
    "getCampaignSetUp",
  );
}

// ── Rutin ──────────────────────────────────────────────────────────────
export async function getRutinDetail(
  slug: number | string,
  token: string | null,
) {
  if (!token) return null;
  return safe(
    () => serverApi(token).get(`/rutin/detail/${slug}`),
    "getRutinDetail",
  );
}

// ── Zakat ──────────────────────────────────────────────────────────────
export async function getNishabZakat() {
  return safe(() => publicApi.get(`/zakat/nishab`), "getNishabZakat");
}

// ── transactions ──────────────────────────────────────────────────────────────

export async function getPaymentMethod(link?: string) {
  return safe(
    () =>
      publicApi.get("/payment/payment-method", {
        params: { program_link: link },
      }),
    "getPaymentMethod",
  );
}

export async function getPaymentMethodFilter(params: any) {
  return safe(
    () =>
      publicApi.get("/payment/payment-method", {
        params,
      }),
    "getPaymentMethodFilter",
  );
}

export async function getInvoice(inv: string | null) {
  return safe(
    () => publicApi.get(`/transactions/invoice/${inv}`),
    "getInvoice",
  );
}

// ── auth ──────────────────────────────────────────────────────────────
// Throws if token is invalid — used as a guard
export async function getIsTokenValid(token: string): Promise<boolean> {
  await serverApi(token).post("/validate-token");
  return true;
}

export async function getUserProfile(token: string) {
  return safe(
    () => serverApi(token).get("/dashboard/donatur/my-account"),
    "getUserProfile",
  );
}

export async function getMyWallet(token: string) {
  return safe(
    () => serverApi(token).get("/dashboard/donatur/my-wallet"),
    "getMyWallet",
  );
}

// export async function getUserProfile(token: string): Promise<any | null> {
//   try {
//     const res = await serverApi(token).get("/dashboard/donatur/my-account");
//     return res?.data ?? null;
//   } catch {
//     return null;
//   }
// }
