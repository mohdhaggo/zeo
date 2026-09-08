/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google reCAPTCHA v2 site key. Set per environment in Cloudflare Pages. */
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
