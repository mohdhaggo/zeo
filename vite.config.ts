import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // No source maps in production. They would be uploaded to the CDN and served
    // publicly, handing anyone the original TypeScript.
    sourcemap: false,
    rollupOptions: {
      output: {
        // React and the router change only when they are upgraded, while the
        // app changes on every deploy. Splitting them means a deploy does not
        // invalidate the ~140 kB of framework a returning visitor already has.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
