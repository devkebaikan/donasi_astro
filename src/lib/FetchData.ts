import type { AxiosResponse } from "axios";
import { publicApi, serverApi } from "./api";

// ── Generic wrapper: returns null on error instead of throwing ────────────────
// Non-generic dengan AxiosResponse eksplisit — hindari T={} inference issue
async function safe(
  fn: () => Promise<AxiosResponse<any>>,
  label: string,
): Promise<any> {
  try {
    const { data } = await fn();
    return data;
  } catch (error) {
    console.error(`[API] ${label}:`, error);
    return null;
  }
}

export async function getCampaignRamadhan() {
  return safe(
    () => publicApi.get("/program-show/ramadhan"),
    "getCampaignRamadhan",
  );
}

export async function getCampaignShow(type: string) {
  return safe(() => publicApi.get(`/program-show/${type}`), "getCampaignShow");
}

// Throws on error (caller handles)
export async function getCampaignByLink(link: string) {
  const { data } = await publicApi.get(`/program/link/${link}`);
  return data;
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
      publicApi.get(`/program/link/${link}/donors`, {
        params: { limit: 10, mode: "pagination", page: 1 },
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

export async function getFundraisersByLink(link: string) {
  return safe(
    () =>
      publicApi.get(`/program/link/${link}/fundraisers`, {
        params: { limit: 6, mode: "pagination", page: 1 },
      }),
    "getFundraisersByLink",
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

export async function getPaymentMethod(link: string) {
  return safe(
    () =>
      publicApi.get("/payment/payment-method", {
        params: { program_link: link },
      }),
    "getPaymentMethod",
  );
}

export async function getInvoice(inv: string | null) {
  return safe(
    () => publicApi.get(`/transactions/invoice/${inv}`),
    "getInvoice",
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
    () => publicApi.get("/project", { params: { program_link: link } }),
    "getProjectByLink",
  );
}

export async function getProjectSummaryByLink(link: string | null) {
  return safe(
    () => publicApi.get("/project/summary", { params: { program_link: link } }),
    "getProjectSummaryByLink",
  );
}

export async function getMitraSalurByLink(link: string | null) {
  return safe(
    () =>
      publicApi.get("/program/mitra-salur", { params: { program_link: link } }),
    "getMitraSalurByLink",
  );
}

export async function getCampaignCategories() {
  return safe(
    () => publicApi.get("/program-category"),
    "getCampaignCategories",
  );
}

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
    () => publicApi.get("/program", { params: filtered }),
    "getAllCampaigns",
  );
}

// Throws if token is invalid — used as a guard
export async function getIsTokenValid(token: string): Promise<boolean> {
  await serverApi(token).post("/validate-token");
  return true;
}

export async function getUserProfile(token: string) {
  return safe(
    () => serverApi(token).get("/dashboard/my-account"),
    "getUserProfile",
  );
}

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

export async function getCampaignSetUp(type: string) {
  return safe(
    () => publicApi.get(`/program-setup/${type}`),
    "getCampaignSetUp",
  );
}
