// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Local hosts can be added via ALLOWED_HOSTS env var (comma-separated)
// Example: ALLOWED_HOSTS=myhost,otherhost bun run dev
const envHosts = process.env.ALLOWED_HOSTS?.split(',').filter(Boolean) || [];
const allowedHosts = ['localhost', '.local', ...envHosts];

export default defineConfig({
  output: 'static',
  integrations: [react()],
  server: {
    host: '0.0.0.0',
    port: 5177
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts
    }
  }
});
