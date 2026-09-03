import { useEffect, type FC } from 'react';
import { BASE_URL, SITE_NAME } from './Seo';

const SCRIPT_ID = 'zeo-structured-data';

/**
 * Organization schema, so Google can render a knowledge panel / rich result
 * rather than treating the site as an unidentified page.
 */
export const StructuredData: FC = () => {
  useEffect(() => {
    const payload = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: BASE_URL + '/zeo_logo.webp',
      description:
        'Premium automotive protection films - Paint Protection Film (PPF), window tint and windshield film engineered for extreme climates.',
      areaServed: ['Middle East', 'Asia', 'Worldwide'],
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);
  }, []);

  return null;
};
