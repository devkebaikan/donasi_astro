// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  output: "static",

  compressHTML: true,

  prefetch: {
    prefetchAll: true,
  },

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
});
