import { renameSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Amplify serves dist/index.html as the app root, but the admin build emits
 * admin.html. Rename it so the admin app is served at "/" on its own domain.
 */
const dist = join(process.cwd(), 'dist');
const source = join(dist, 'admin.html');
const target = join(dist, 'index.html');

if (!existsSync(source)) {
  console.error('x Expected dist/admin.html - did "vite build --mode admin" run?');
  process.exit(1);
}

if (existsSync(target)) rmSync(target);
renameSync(source, target);
console.log('OK admin build finalized: dist/admin.html -> dist/index.html');
