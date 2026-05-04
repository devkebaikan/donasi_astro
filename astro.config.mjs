// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",

  integrations: [sitemap()],

  adapter: node({ mode: "standalone" }),

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
