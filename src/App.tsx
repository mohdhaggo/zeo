import type React from 'react';
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

/**
 * Every page is code-split.
 *
 * The build used to emit one chunk carrying all twelve pages, so a visitor
 * reading the homepage downloaded the three 860-line product pages, the
 * warranty flow and the legal documents before anything appeared. Navigation
 * here is by plain href rather than router links, which means each click is a
 * fresh document load - so splitting pays off on every page view, not just the
 * first.
 */
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProductsPage = lazy(() =>
  import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })),
);
const PPFPage = lazy(() => import('./pages/PPFPage').then((m) => ({ default: m.PPFPage })));
const TitanPPFPage = lazy(() =>
  import('./pages/TitanPPFPage').then((m) => ({ default: m.TitanPPFPage })),
);
const UltraPPFPage = lazy(() =>
  import('./pages/UltraPPFPage').then((m) => ({ default: m.UltraPPFPage })),
);
const TitanSatinPPFPage = lazy(() =>
  import('./pages/TitanSatinPPFPage').then((m) => ({ default: m.TitanSatinPPFPage })),
);
const WarrantyPage = lazy(() =>
  import('./pages/WarrantyPage').then((m) => ({ default: m.WarrantyPage })),
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/legal/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
);
const TermsPage = lazy(() => import('./pages/legal/TermsPage').then((m) => ({ default: m.TermsPage })));
const RefundPolicyPage = lazy(() =>
  import('./pages/legal/RefundPolicyPage').then((m) => ({ default: m.RefundPolicyPage })),
);
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Seo } from './components/common/Seo';
import { StructuredData } from './components/common/StructuredData';
import { CookieConsent } from './components/common/CookieConsent';
import { loadConsentedAnalytics, trackPageView } from './lib/analytics';
import seoRoutes from './config/seo-routes.json';

/**
 * Which component renders each path.
 *
 * The titles, descriptions and social images live in seo-routes.json instead
 * of here, because the sitemap generator and the prerender step read the same
 * file. When they were separate lists the sitemap and the route table drifted,
 * and a page prerendered with no matching route would have 404'd on a direct
 * hit while still being advertised to Google.
 */
const ELEMENTS: Record<string, React.ReactElement> = {
  '/': <HomePage />,
  '/about': <AboutPage />,
  '/products': <ProductsPage />,
  '/ppf-cat': <PPFPage />,
  '/titan-ppf': <TitanPPFPage />,
  '/ultra-ppf': <UltraPPFPage />,
  '/titan-satin-ppf': <TitanSatinPPFPage />,
  '/warranty': <WarrantyPage />,
  '/contact': <ContactPage />,
  '/privacy-policy': <PrivacyPolicyPage />,
  // The footer has linked to /terms-conditions since before the page existed,
  // so that path is kept rather than renamed.
  '/terms-conditions': <TermsPage />,
  '/refund-policy': <RefundPolicyPage />,
};

/**
 * Starts analytics and reports route changes.
 *
 * Lives inside BrowserRouter because useLocation needs the router context.
 * Without it a single-page app reports one page view per session - the landing
 * page - and every navigation after that is invisible.
 */
const Analytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Cloudflare Web Analytics is injected at the edge and needs nothing here.
    // A returning visitor who already accepted GA4 should not be asked again.
    loadConsentedAnalytics();
  }, []);

  useEffect(() => {
    // Seo sets document.title in its own effect. Reading it on the next frame
    // gets this page's title rather than the previous page's.
    const frame = requestAnimationFrame(() =>
      trackPageView(location.pathname + location.search, document.title),
    );
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.search]);

  return null;
};

/** Matches the page background so a chunk load is not a white flash. */
const PageFallback = () => (
  <div style={{ minHeight: '70vh', background: '#010101' }} aria-busy="true" />
);

function App() {
  return (
    <BrowserRouter>
      <StructuredData />
      <Analytics />
      <Suspense fallback={<PageFallback />}>
      <Routes>
        {seoRoutes.routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <>
                <Seo
                  path={route.path}
                  title={route.title}
                  description={route.description}
                  image={'image' in route ? route.image : undefined}
                />
                <Navbar />
                {ELEMENTS[route.path]}
                <Footer />
              </>
            }
          />
        ))}

        <Route
          path="*"
          element={
            <>
              <Seo
                path="/404"
                title="Page Not Found"
                description="The page you are looking for does not exist."
                noindex
              />
              <Navbar />
              <NotFoundPage />
              <Footer />
            </>
          }
        />
      </Routes>
      </Suspense>
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
