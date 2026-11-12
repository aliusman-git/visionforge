import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Netlify rewrites files in .netlify while "netlify dev" runs; on Windows
      // Vite's file watcher crashes (EBUSY) if it tries to watch them.
      ignored: ['**/.netlify/**'],
    },
  },
});