import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { PPFPage } from './pages/PPFPage';
import { TitanPPFPage } from './pages/TitanPPFPage';
import { UltraPPFPage } from './pages/UltraPPFPage';
import { TitanSatinPPFPage } from './pages/TitanSatinPPFPage';
import { WarrantyPage } from './pages/WarrantyPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

function App() {
  const path = window.location.pathname;
  
  // Admin routes (no navbar/footer)
  if (path === '/admin-login') return <AdminLoginPage />;
  if (path === '/dashboard') return <AdminDashboard />;
  
  // Public routes with navbar/footer
  const getPublicPage = () => {
    if (path === '/about') return <AboutPage />;
    if (path === '/products') return <ProductsPage />;
    if (path === '/ppf-cat') return <PPFPage />;
    if (path === '/titan-ppf') return <TitanPPFPage />;
    if (path === '/ultra-ppf') return <UltraPPFPage />;
    if (path === '/titan-satin-ppf') return <TitanSatinPPFPage />;
    if (path === '/warranty') return <WarrantyPage />;
    if (path === '/contact') return <ContactPage />;
    return <HomePage />;
  };

  return (
    <>
      <Navbar />
      {getPublicPage()}
      <Footer />
    </>
  );
}

export default App;