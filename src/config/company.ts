/**
 * Company facts used by the legal pages and the structured data.
 *
 * These are kept in one file because the same values appear in the privacy
 * policy, the terms, the refund policy and the schema.org markup, and a
 * mismatch between them is the kind of thing nobody notices until it matters.
 *
 * TODO(owner): replace every value marked PLACEHOLDER before publishing. A
 * legal page that names the wrong entity is worse than one that names none,
 * so these are deliberately obvious rather than plausible-looking guesses.
 */
export const COMPANY = {
  /** Trading name, safe to use anywhere. */
  brand: 'Zeo Shields',

  /** PLACEHOLDER - registered legal name as it appears on the business licence. */
  legalName: '[REGISTERED COMPANY NAME]',

  /** PLACEHOLDER - Unified Social Credit Code from the business licence. */
  registrationNumber: '[UNIFIED SOCIAL CREDIT CODE]',

  /** PLACEHOLDER - registered address. */
  address: '[REGISTERED ADDRESS]',

  /** Country of registration. Governs the legal pages. */
  country: 'China',

  /** The law the terms are read under, and the courts that hear disputes. */
  governingLaw: 'the laws of the People’s Republic of China',
  /** PLACEHOLDER - the city whose courts have jurisdiction. */
  courts: 'the competent People’s Court in [CITY]',

  /** Reachable addresses. These are live. */
  contactEmail: 'info@zeoshields.com',
  privacyEmail: 'info@zeoshields.com',

  /** Canonical site host, matching Seo.tsx. */
  siteUrl: 'https://www.zeoshields.com',
} as const;

/**
 * Social profiles.
 *
 * The footer renders an icon only where the URL is filled in. The icons used
 * to be hardcoded links to "#", which look like working links, do nothing when
 * clicked, and are read out by screen readers as navigable. An empty string
 * here removes the icon entirely, which is the honest result until the
 * account exists.
 *
 * TODO(owner): paste the real profile URLs in.
 */
export const SOCIAL: ReadonlyArray<{ name: string; url: string; icon: string }> = [
  { name: 'Instagram', url: '', icon: 'fa-instagram' },
  { name: 'X', url: '', icon: 'fa-x-twitter' },
  { name: 'TikTok', url: '', icon: 'fa-tiktok' },
  { name: 'LinkedIn', url: '', icon: 'fa-linkedin' },
];

/**
 * Last substantive revision of the legal pages.
 *
 * Hardcoded rather than generated: a policy that silently re-dates itself on
 * every deploy tells the reader nothing about when the terms actually changed.
 */
export const LEGAL_LAST_UPDATED = '10 September 2026';
