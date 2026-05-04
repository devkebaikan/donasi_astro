import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const token = context.cookies.get("authToken")?.value ?? null;
  context.locals.auth = {
    isAuthenticated: Boolean(token),
    token,
  };
  return next();
});
