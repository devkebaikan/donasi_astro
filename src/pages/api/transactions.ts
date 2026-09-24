// src/pages/api/transactions.ts
import type { APIRoute } from "astro";

// WAJIB TAMBAHKAN INI AGAR BISA TERIMA POST REQUEST
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("authToken")?.value || null;
  const clientKey = import.meta.env.CLIENT_KEY;
  const baseUrl = process.env.INTERNAL_API_URL ?? import.meta.env.PUBLIC_API_URL;

  if (!baseUrl || !clientKey) {
    return new Response(
      JSON.stringify({ message: "Konfigurasi server belum lengkap" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Ambil body sebagai text
  const rawBody = await request.text();
  
  if (!rawBody) {
    return new Response(
      JSON.stringify({ message: "Body request kosong" }), 
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response(
      JSON.stringify({ message: "Format JSON tidak valid" }), 
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const res = await fetch(`${baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Client-Key": clientKey,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { message: responseText };
    }

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Gagal terhubung ke server backend" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};