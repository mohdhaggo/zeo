/**
 * Cookie consent state.
 *
 * Kept deliberately small and synchronous. The rule the rest of the code
 * relies on: nothing that sets a cookie may load until `hasAnalyticsConsent()`
 * returns true. Consent-mode style "load it but ask it to behave" is not used,
 * because a script that has already loaded has already been given the
 * visitor's IP address.
 *
 * The stored value carries a version. Bumping POLICY_VERSION re-asks everyone,
 * which is what has to happen when a new recipient or purpose is added to the
 * privacy policy.
 */
const STORAGE_KEY = 'zeo.cookie-consent';
const POLICY_VERSION = 1;

export type ConsentChoice = 'accepted' | 'declined';

interface StoredConsent {
  version: number;
  choice: ConsentChoice;
  at: string;
}

/** Fired on the window whenever the choice changes, so listeners can react. */
export const CONSENT_EVENT = 'zeo:consent-changed';

function read(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    // A choice recorded against an older policy is not consent to the new one.
    if (parsed.version !== POLICY_VERSION) return null;
    if (parsed.choice !== 'accepted' && parsed.choice !== 'declined') return null;
    return parsed;
  } catch {
    // Private browsing, disabled storage, or corrupt JSON. Treat as no choice
    // yet rather than as consent - the safe direction to fail in.
    return null;
  }
}

/** null means the visitor has not answered yet and the banner should show. */
export function getConsent(): ConsentChoice | null {
  return read()?.choice ?? null;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === 'accepted';
}

export function setConsent(choice: ConsentChoice): void {
  try {
    const value: StoredConsent = {
      version: POLICY_VERSION,
      choice,
      at: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage unavailable. The choice still applies for this page view via the
    // event below; the banner will simply ask again next time.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

/**
 * Clears the recorded choice so the banner reappears.
 *
 * Withdrawing consent has to be as easy as giving it, which is why the footer
 * carries a link to this. Note that clearing the flag stops any future load of
 * Google Analytics but cannot retract a script already running in this tab, so
 * the caller reloads the page.
 */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
