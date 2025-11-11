import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Vite configuration optimized for Vercel deployment
export default defineConfig({
  plugins: [react()],

  // ✅ Fix white screen and MIME type errors
  base: './',

  server: {
    port: 3000,
  },

  define: {
    'process.env': {},
  },

  // ✅ Build settings for production
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  },
});
