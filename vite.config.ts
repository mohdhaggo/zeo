import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

/**
 * Two builds from one codebase:
 *
 *   vite build                -> public site  (index.html  -> src/main.tsx)
 *   vite build --mode admin   -> admin console (admin.html -> src/admin/main.tsx)
 *
 * They are deployed as separate Amplify apps, so the admin bundle is never
 * served to public visitors.
 */
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: mode === 'admin' ? resolve(projectRoot, 'admin.html') : resolve(projectRoot, 'index.html'),
    },
  },
}));
