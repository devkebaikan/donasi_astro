// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Ganti dengan domain production Anda — digunakan untuk canonical URL & OG image
  site: 'https://example.com',

  vite: {
    plugins: [tailwindcss()],
  },
});
