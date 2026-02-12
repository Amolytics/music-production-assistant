// vite.config.mjs (ESM)
import { defineConfig } from 'vite';

// Use VITE_PORT from environment, default to 8080
const port = parseInt(process.env.VITE_PORT) || 8080;
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    }
  },
  server: {
    port
  }
});
