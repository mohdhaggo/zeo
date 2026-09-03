import type React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { PPFPage } from './pages/PPFPage';
import { TitanPPFPage } from './pages/TitanPPFPage';
import { UltraPPFPage } from './pages/UltraPPFPage';
import { TitanSatinPPFPage } from './pages/TitanSatinPPFPage';
import { WarrantyPage } from './pages/WarrantyPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Seo, type SeoProps } from './components/common/Seo';
import { StructuredData } from './components/common/StructuredData';

/**
 * Route table. Keeping the SEO metadata beside each route means every page has
 * its own title, description and canonical URL without touching the page
 * components themselves.
 */
interface AppRoute {
  path: string;
  element: React.ReactElement;
  seo: SeoProps;
}

const routes: AppRoute[] = [
  {
    path: '/',
    element: <HomePage />,
    seo: {
      path: '/',
      title: 'Zeo Shields | Premium Paint Protection Film, Window Tint & Windshield Film',
      description:
        'Premium automotive protection films engineered for extreme climates. PPF, window tint and windshield film for the Middle East, Asia and global markets.',
    },
  },
  {
    path: '/about',
    element: <AboutPage />,
    seo: {
      path: '/about',
      title: 'About Us',
      description:
        'Zeo Shields delivers advanced Paint Protection Film, window tint and windshield protection built for performance, durability and extreme climates.',
    },
  },
  {
    path: '/products',
    element: <ProductsPage />,
    seo: {
      path: '/products',
      title: 'Products',
      description:
        'Explore the Zeo Shields range: Paint Protection Film, window tint and windshield protection film for cars, fleets and enthusiasts.',
    },
  },
  {
    path: '/ppf-cat',
    element: <PPFPage />,
    seo: {
      path: '/ppf-cat',
      title: 'Paint Protection Film (PPF)',
      description:
        'Zeo Shields Paint Protection Film with self-healing top coat, UV and heat resistance, and up to a 10 year warranty. Engineered for extreme conditions.',
      image: '/PPF-cat.webp',
    },
  },
  {
    path: '/titan-ppf',
    element: <TitanPPFPage />,
    seo: {
      path: '/titan-ppf',
      title: 'TITAN PPF - Maximum Protection Paint Protection Film',
      description:
        'TITAN PPF delivers maximum impact protection with a self-healing top coat and a 5 year warranty. Built for high-speed roads and harsh climates.',
      image: '/01-titan-ppf-blue.webp',
    },
  },
  {
    path: '/ultra-ppf',
    element: <UltraPPFPage />,
    seo: {
      path: '/ultra-ppf',
      title: 'ULTRA PPF - Advanced Paint Protection Film',
      description:
        'ULTRA PPF combines advanced nano-coating technology with reliable long-term protection and an 8 year warranty.',
      image: '/01-ultra-ppf-red.webp',
    },
  },
  {
    path: '/titan-satin-ppf',
    element: <TitanSatinPPFPage />,
    seo: {
      path: '/titan-satin-ppf',
      title: 'PRIME PPF - Premium Satin Finish Paint Protection Film',
      description:
        'PRIME PPF pairs a premium satin finish with ultimate paint protection and a 10 year warranty.',
      image: '/01-prime-ppf-white.webp',
    },
  },
  {
    path: '/warranty',
    element: <WarrantyPage />,
    seo: {
      path: '/warranty',
      title: 'Warranty Policy & Validation',
      description:
        'Validate and register your Zeo Shields warranty. Check coverage, registration status and warranty terms for your protection film.',
    },
  },
  {
    path: '/contact',
    element: <ContactPage />,
    seo: {
      path: '/contact',
      title: 'Contact Distributors',
      description:
        'Talk to the Zeo Shields team about distribution, pricing and technical support across the Middle East, Asia and worldwide.',
      image: '/contact.webp',
    },
  },
];

function App() {
  return (
    <BrowserRouter>
      <StructuredData />
      <Routes>
        {routes.map(({ path, element, seo }) => (
          <Route
            key={path}
            path={path}
            element={
              <>
                <Seo {...seo} />
                <Navbar />
                {element}
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
    </BrowserRouter>
  );
}

export default App;
