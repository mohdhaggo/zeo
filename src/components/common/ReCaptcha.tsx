import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SCRIPT_ID = 'google-recaptcha-script';
const ONLOAD_CALLBACK = '__zeoRecaptchaOnLoad';
const SCRIPT_SRC =
  'https://www.google.com/recaptcha/api.js?render=explicit&onload=' + ONLOAD_CALLBACK;

interface ReCaptchaApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      theme?: 'light' | 'dark';
      size?: 'normal' | 'compact';
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => number;
  reset: (widgetId?: number) => void;
}

declare global {
  interface Window {
    grecaptcha?: ReCaptchaApi;
    [ONLOAD_CALLBACK]?: () => void;
  }
}

export interface ReCaptchaHandle {
  /** Clears the current token and shows a fresh challenge. */
  reset: () => void;
}

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
}

let scriptPromise: Promise<void> | null = null;

/**
 * Loads the reCAPTCHA script once, shared across every mount.
 *
 * Google only guarantees `grecaptcha.render` exists after it calls the onload
 * callback named in the script URL. Waiting on the script tag's own load event
 * is not enough - the object appears a moment later - so this resolves from
 * that callback instead.
 */
function loadScript(): Promise<void> {
  if (window.grecaptcha?.render) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve) => {
    window[ONLOAD_CALLBACK] = () => resolve();

    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Google reCAPTCHA v2 checkbox widget.
 *
 * Script-based rather than an npm wrapper, so the bundle gains no dependency
 * for what is a dozen lines of DOM work. The token it produces means nothing
 * until /api/contact verifies it with Google server-side - a client that skips
 * the widget simply gets rejected there.
 */
export const ReCaptcha = forwardRef<ReCaptchaHandle, ReCaptchaProps>(
  ({ siteKey, onVerify, onExpire }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      let cancelled = false;

      void loadScript().then(() => {
        if (cancelled || !containerRef.current || !window.grecaptcha) return;
        // React 18 StrictMode mounts effects twice in development. reCAPTCHA
        // throws if asked to render into an element it already occupies, so
        // this guard is load-bearing rather than tidiness.
        if (widgetIdRef.current !== null) return;

        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          callback: onVerify,
          'expired-callback': onExpire,
          'error-callback': onExpire,
        });
      });

      return () => {
        cancelled = true;
        // reCAPTCHA has no remove(), unlike Turnstile. Emptying the container
        // is what lets a later mount render into it again without throwing.
        if (widgetIdRef.current !== null) {
          if (containerRef.current) containerRef.current.innerHTML = '';
          widgetIdRef.current = null;
        }
      };
      // Re-rendering the widget on every callback identity change would reset
      // the visitor's challenge, so this intentionally depends only on the key.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey]);

    return <div ref={containerRef} />;
  },
);

ReCaptcha.displayName = 'ReCaptcha';
