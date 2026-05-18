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
    <>
      <PageHeader />
      <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
        <CategoryGrid />
        <h2 className="fade-section" style={{ fontSize: '2rem', marginTop: '60px' }}>Why Choose Zeo Shields</h2>
        <div className="feature-grid fade-section" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          textAlign: 'center',
          margin: '50px 0'
        }}>
          {features.map((feature, index) => (
            <div key={index}>
              <i className={`fas ${feature.icon} feature-icon`} style={{
                fontSize: '2.8rem',
                background: 'linear-gradient(145deg, #E50914, #8A0A10)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }} />
              <h3 style={{ margin: '15px 0 10px' }}>{feature.title}</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{feature.description}</p>
            </div>
          ))}
        </div>
        <CTASection />
      </div>
    </>
  );
};