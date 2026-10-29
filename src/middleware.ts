import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const token = !context.isPrerendered
    ? context.cookies.get("authToken")?.value ?? null
    : null;
  context.locals.auth = {
    isAuthenticated: Boolean(token),
    token,
  };

  // Tangkap reff_code dari URL param dan simpan ke cookie 12 jam (43200 detik)
  const incomingReff =
    context.url.searchParams.get("reff_code") ||
    context.url.searchParams.get("ref");

  if (incomingReff && incomingReff.trim() !== "") {
    context.cookies.set("reff_code", incomingReff.trim(), {
      path: "/",
      maxAge: 12 * 60 * 60, // 12 jam
      sameSite: "lax",
      httpOnly: false,
    });
  }

  // Tangkap leads dari URL param dan simpan ke cookie 12 jam (43200 detik)
  const incomingLeads = context.url.searchParams.get("leads");
  if (incomingLeads && incomingLeads.trim() !== "") {
    context.cookies.set("leads", incomingLeads.trim(), {
      path: "/",
      maxAge: 12 * 60 * 60, // 12 jam
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return next();
});
