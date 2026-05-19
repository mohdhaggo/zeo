import { useEffect } from 'react';
import { PageHeader } from '../components/products/PageHeader';
import { CategoryGrid } from '../components/products/CategoryGrid';
import { CTASection } from '../components/common/CTASection';

export const ProductsPage: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const fadeElements = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: "fa-shield-alt", title: "Maximum Protection", description: "Military-grade shield against all hazards" },
    { icon: "fa-layer-group", title: "Advanced Technology", description: "State-of-the-art nano coating" },
    { icon: "fa-sync-alt", title: "Self-Healing Top Coat", description: "Surface renews itself from minor scratches" },
    { icon: "fa-sun", title: "UV & Heat Resist", description: "Engineered for extreme climates globally" },
    { icon: "fa-check-circle", title: "Warranty Assured", description: "International warranty for peace of mind" }
  ];

  return (
    <div className="products-responsive-wrapper">
      <div className="page-header-wrapper fade-section">
        <PageHeader />
      </div>
      <div className="products-content-container">
        <CategoryGrid />
        
        <h2 className="fade-section products-title">Why Choose Zeo Shields</h2>
        
        <div className="feature-grid fade-section">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <i className={`fas ${feature.icon} feature-icon`} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        
        <CTASection />
      </div>

      <style>{`
        /* Responsive wrapper */
        .products-responsive-wrapper {
          width: 100%;
          overflow-x: hidden;
        }
        
        /* Page Header Wrapper - Mobile Responsive Fix */
        .page-header-wrapper {
          width: 100%;
          overflow-x: hidden;
        }
        
        /* Override any PageHeader internal styles to ensure no text chopping */
        .page-header-wrapper [class*="header"],
        .page-header-wrapper [class*="hero"],
        .page-header-wrapper [class*="banner"] {
          padding-left: clamp(12px, 4vw, 30px) !important;
          padding-right: clamp(12px, 4vw, 30px) !important;
          box-sizing: border-box !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        
        /* Fix for any text elements inside PageHeader */
        .page-header-wrapper h1,
        .page-header-wrapper h2,
        .page-header-wrapper p,
        .page-header-wrapper span,
        .page-header-wrapper div {
          max-width: 100%;
          word-wrap: break-word;
          white-space: normal;
        }
        
        /* Specific fix for main title in PageHeader */
        .page-header-wrapper h1 {
          font-size: clamp(1.8rem, 6vw, 3rem) !important;
          line-height: 1.2 !important;
          padding: 0 clamp(10px, 3vw, 20px) !important;
          text-align: center !important;
        }
        
        /* Fix for subtitle/description text */
        .page-header-wrapper p {
          font-size: clamp(0.9rem, 3.5vw, 1.1rem) !important;
          line-height: 1.5 !important;
          padding: 0 clamp(15px, 4vw, 30px) !important;
          margin: 10px auto !important;
          max-width: 90% !important;
        }
        
        .products-content-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 clamp(12px, 4vw, 30px);
          width: 100%;
          box-sizing: border-box;
        }
        
        /* Title styles */
        .products-title {
          font-size: clamp(1.5rem, 5vw, 2rem);
          margin-top: clamp(40px, 8vw, 60px);
          margin-bottom: clamp(20px, 4vw, 30px);
          text-align: center;
          padding: 0 15px;
        }
        
        /* Feature grid */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: clamp(20px, 5vw, 32px);
          text-align: center;
          margin: clamp(30px, 6vw, 50px) 0;
        }
        
        /* Feature card */
        .feature-card {
          padding: clamp(15px, 3vw, 20px);
          transition: transform 0.3s ease;
          cursor: pointer;
          background: rgba(10, 10, 15, 0.5);
          border-radius: 20px;
        }
        
        .feature-icon {
          font-size: clamp(2rem, 6vw, 2.8rem);
          background: linear-gradient(145deg, #E50914, #8A0A10);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
          margin-bottom: 15px;
        }
        
        .feature-card h3 {
          margin: clamp(10px, 3vw, 15px) 0 clamp(8px, 2vw, 10px);
          font-size: clamp(1.1rem, 4vw, 1.3rem);
          font-weight: 600;
          color: white;
        }
        
        .feature-card p {
          color: #aaa;
          font-size: clamp(0.85rem, 3vw, 0.9rem);
          line-height: 1.5;
          padding: 0 10px;
        }
        
        /* Fade animations */
        .fade-section { 
          opacity: 0; 
          transform: translateY(30px); 
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
        }
        
        .fade-section.visible { 
          opacity: 1; 
          transform: translateY(0); 
        }
        
        /* Desktop hover effect */
        @media (min-width: 769px) {
          .feature-card:hover {
            transform: translateY(-5px);
          }
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .feature-grid {
            gap: 15px;
          }
          
          .feature-card {
            padding: 15px;
          }
          
          .feature-card:active {
            transform: scale(0.98);
          }
          
          /* Additional mobile fixes for PageHeader */
          .page-header-wrapper {
            padding-top: clamp(20px, 5vw, 40px);
            padding-bottom: clamp(20px, 5vw, 40px);
          }
          
          .page-header-wrapper h1 {
            font-size: clamp(1.5rem, 5vw, 2.2rem) !important;
            padding: 0 15px !important;
          }
          
          .page-header-wrapper p {
            font-size: clamp(0.85rem, 3vw, 1rem) !important;
            padding: 0 20px !important;
            max-width: 95% !important;
          }
        }
        
        /* Small mobile */
        @media (max-width: 480px) {
          .feature-grid {
            grid-template-columns: 1fr;
          }
          
          .products-title {
            margin-top: 30px;
          }
          
          /* Small screen fixes for PageHeader */
          .page-header-wrapper h1 {
            font-size: clamp(1.3rem, 6vw, 1.8rem) !important;
            padding: 0 12px !important;
          }
          
          .page-header-wrapper p {
            font-size: clamp(0.8rem, 4vw, 0.9rem) !important;
            padding: 0 15px !important;
          }
          
          .page-header-wrapper {
            padding-top: 15px;
            padding-bottom: 15px;
          }
        }
        
        /* Tablet */
        @media (min-width: 769px) and (max-width: 1024px) {
          .feature-grid {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
          }
          
          .page-header-wrapper h1 {
            font-size: clamp(2rem, 5vw, 2.8rem) !important;
          }
        }
        
        /* Landscape mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .feature-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
          
          .page-header-wrapper {
            padding-top: 10px;
            padding-bottom: 10px;
          }
          
          .page-header-wrapper h1 {
            font-size: clamp(1.2rem, 4vw, 1.6rem) !important;
          }
        }
        
        /* Responsive images */
        .products-content-container img {
          max-width: 100%;
          height: auto;
        }
        
        /* Prevent horizontal scroll */
        html, body {
          overflow-x: hidden;
          width: 100%;
        }
        
        /* iOS smooth scrolling */
        .products-responsive-wrapper {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Reduce motion preference */
        @media (prefers-reduced-motion: reduce) {
          .fade-section,
          .feature-card {
            transition: none !important;
          }
          
          .feature-card:hover {
            transform: none;
          }
        }
        
        /* Better touch targets for mobile */
        @media (hover: none) and (pointer: coarse) {
          .feature-card {
            min-height: 44px;
          }
        }
        
        /* Ensure text never gets chopped on any screen */
        * {
          word-break: break-word;
        }
      `}</style>
    </div>
  );
};