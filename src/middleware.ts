import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const token = !context.isPrerendered
    ? context.cookies.get("authToken")?.value ?? null
    : null;
  context.locals.auth = {
    isAuthenticated: Boolean(token),
    token,
  };
  return next();
});
