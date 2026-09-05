import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// The public site talks to Cloudflare Pages Functions over plain fetch, so it
// no longer configures the Amplify SDK. The admin app still does, until the
// admin portal moves across.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
