import { useEffect, type FC } from 'react';

export const SITE_NAME = 'Zeo Shields';
export const BASE_URL = 'https://zeoshields.com';
const DEFAULT_IMAGE = '/zeo_landing.webp';

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

function setMeta(keyName: 'name' | 'property', keyValue: string, content: string) {
  const selector = 'meta[' + keyName + '="' + keyValue + '"]';
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(keyName, keyValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(href: string) {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Per-route document metadata.
 *
 * This is a client-rendered SPA, so every route previously shared the single
 * title and description baked into index.html - which is why the site had no
 * distinct entry per page in search results. Rendering this in each route
 * gives crawlers a unique title, description, canonical URL and social card.
 */
export const Seo: FC<SeoProps> = ({ title, description, path, image, noindex }) => {
  useEffect(() => {
    const url = BASE_URL + path;
    const fullTitle = path === '/' ? title : title + ' | ' + SITE_NAME;
    const imageUrl = BASE_URL + (image ?? DEFAULT_IMAGE);

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setCanonical(url);

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', imageUrl);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);
  }, [title, description, path, image, noindex]);

  return null;
};
