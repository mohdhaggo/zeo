import { hasAnalyticsConsent } from './consent';

/**
 * Analytics loading.
 *
 * Two tools with different consent rules, and only one of them lives here.
 *
 * Cloudflare Web Analytics is already running. It is injected at the edge by
 * Cloudflare itself, not by this code - a script tag appears before </body> on
 * every response, carrying "spa":2, which means it already reports react-router
 * navigations on its own. Loading a second beacon from here would double every
 * page view, so this file deliberately does not touch it. It is cookieless, so
 * it needs no consent and keeps working for visitors who decline.
 *
 * Google Analytics 4 sets cookies, so it is not injected at all until the
 * visitor accepts. Declining means the script never reaches the page - the
 * consent-mode approach of loading it and asking it to behave is not used,
 * because a script that has loaded has already been given the visitor's IP
 * address.
 *
 * VITE_ variables are inlined by Vite at build time, so changing the
 * measurement ID in the Cloudflare dashboard does nothing until a redeploy.
 */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

const GA_SCRIPT_ID = 'ga4-script';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Whether there is anything for a visitor to consent to.
 *
 * When no measurement ID is configured, nothing on the site sets a cookie, so
 * showing a consent banner would be asking permission for something that never
 * happens. The banner checks this before rendering.
 */
export const analyticsRequiresConsent = GA_ID !== '';

/**
 * Google Analytics 4. Only ever called once consent is recorded.
 *
 * send_page_view is switched off because this is a single-page app: the
 * automatic initial page view would be the only one GA ever recorded, and every
 * later route change would be invisible. trackPageView reports them instead.
 */
export function loadConsentedAnalytics(): void {
  if (!GA_ID || !hasAnalyticsConsent()) return;
  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = GA_SCRIPT_ID;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });
}

/** Reports a route change to GA4. A no-op when GA was never loaded. */
export function trackPageView(path: string, title: string): void {
  if (!window.gtag || !hasAnalyticsConsent()) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}
