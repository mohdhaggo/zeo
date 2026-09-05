import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

/**
 * One build, two entry documents:
 *
 *   index.html  -> src/main.tsx        the public site
 *   admin.html  -> src/admin/main.tsx  the admin console
 *
 * Cloudflare Pages allows only one project per repository, so both are served
 * from the same deployment and functions/_middleware.ts routes between them by
 * hostname. Rollup still splits them into separate chunks; only genuinely
 * shared code (React, the router) ends up in a common chunk.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(projectRoot, 'index.html'),
        admin: resolve(projectRoot, 'admin.html'),
      },
    },
  },
});
