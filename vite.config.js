import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // When running `netlify dev`, Netlify proxies :8888 -> :5173 and
      // serves /.netlify/functions itself, so this proxy is only a
      // fallback for plain `vite dev` usage.
      '/.netlify/functions': 'http://localhost:9999'
    }
  }
});
