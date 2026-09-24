import type { APIRoute } from "astro";

export const prerender = false;

const allowedPaths = [
  /^auth\/request-otp$/,
  /^auth\/login$/,
  /^otp$/,
  /^auth\/otp$/,
  /^auth\/set-password$/,
  /^logout$/,
  /^dashboard\/donatur\/change-personal-data$/,
  /^dashboard\/donatur\/change-password$/,
  /^rutin\/store$/,
  /^dashboard\/my-rutin\/[^/]+\/stop$/,
  /^dashboard\/donatur\/my-account$/,
  /^dashboard\/donatur\/my-rutin$/,
];

export const ALL: APIRoute = async ({ params, request, cookies }) => {
  const path = params.path ?? "";
  const isGetAccountRequest =
    request.method === "GET" &&
    (path === "dashboard/donatur/my-account" ||
      path === "dashboard/donatur/my-rutin");
  if (request.method !== "POST" && !isGetAccountRequest) {
    return new Response(JSON.stringify({ message: "Method tidak diizinkan" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!allowedPaths.some((pattern) => pattern.test(path))) {
    return new Response(JSON.stringify({ message: "Endpoint tidak diizinkan" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const baseUrl = process.env.INTERNAL_API_URL ?? import.meta.env.PUBLIC_API_URL;
  const clientKey = import.meta.env.CLIENT_KEY;
  if (!baseUrl || !clientKey) {
    return new Response(
      JSON.stringify({ message: "Konfigurasi server belum lengkap" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const token = cookies.get("authToken")?.value;
  const headers = new Headers({
    Accept: "application/json",
    "X-Client-Key": clientKey,
  });
  headers.set("Content-Type", "application/json");
  const authorization = request.headers.get("Authorization");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else if (authorization) {
    headers.set("Authorization", authorization);
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(`${baseUrl}/${path}`);
  upstreamUrl.search = incomingUrl.search;

  const response = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" ? undefined : await request.text(),
  });

  return new Response(response.body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
};