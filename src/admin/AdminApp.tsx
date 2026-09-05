import type { FC } from 'react';
import { AdminDashboard } from '../pages/AdminDashboard';

/**
 * Admin console shell.
 *
 * Authentication happens at the edge: Cloudflare Access blocks unauthenticated
 * requests before this bundle is served, and every /api/admin route
 * independently verifies the Access JWT. There is no in-app login to bypass -
 * which is the point, since the previous gate was a localStorage flag anyone
 * could set from devtools.
 */
export const AdminApp: FC = () => <AdminDashboard />;
