import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminApp } from './AdminApp';
import '../index.css';

// No SDK configuration: the admin console talks to its own /api/admin routes,
// and Cloudflare Access authenticates the request before it reaches this code.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>,
);
