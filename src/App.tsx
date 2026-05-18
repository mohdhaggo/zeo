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
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes (no navbar/footer) */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        
        {/* Public routes with navbar/footer */}
        <Route path="/" element={
          <>
            <Navbar />
            <HomePage />
            <Footer />
          </>
        } />
        <Route path="/about" element={
          <>
            <Navbar />
            <AboutPage />
            <Footer />
          </>
        } />
        <Route path="/products" element={
          <>
            <Navbar />
            <ProductsPage />
            <Footer />
          </>
        } />
        <Route path="/ppf-cat" element={
          <>
            <Navbar />
            <PPFPage />
            <Footer />
          </>
        } />
        <Route path="/titan-ppf" element={
          <>
            <Navbar />
            <TitanPPFPage />
            <Footer />
          </>
        } />
        <Route path="/ultra-ppf" element={
          <>
            <Navbar />
            <UltraPPFPage />
            <Footer />
          </>
        } />
        <Route path="/titan-satin-ppf" element={
          <>
            <Navbar />
            <TitanSatinPPFPage />
            <Footer />
          </>
        } />
        <Route path="/warranty" element={
          <>
            <Navbar />
            <WarrantyPage />
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <ContactPage />
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;