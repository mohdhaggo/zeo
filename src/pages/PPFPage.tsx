import React, { useEffect } from 'react';

export const PPFPage: React.FC = () => {
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const products = [
    { name: 'TITAN PPF', shortDesc: 'Maximum protection PPF with 10-year durability', imgUrl: '/01-titan-ppf-white.webp', badge: '10 YEAR WARRANTY', url: '/titan-ppf' },
    { name: 'ULTRA PPF', shortDesc: 'Reliable protection with advanced technology', imgUrl: '/01-ultra-ppf-red.webp', badge: '5 YEAR WARRANTY', url: '/ultra-ppf' },
    { name: 'TITAN SATIN PPF', shortDesc: 'Premium satin finish with ultimate protection', imgUrl: '/01-stain-ppf-blue.webp', badge: 'SATIN FINISH', url: '/titan-satin-ppf' }
  ];

  const handleProductClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <>
      {/* Category Header */}
      <section className="category-header fade-section" style={{
        background: 'linear-gradient(135deg, #0f0a0a, #080505)',
        padding: '80px 0 60px',
        textAlign: 'center',
        borderBottom: '2px solid #E50914',
        marginBottom: '60px'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', background: 'linear-gradient(135deg, #E50914, #FF6B6B)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            <i className="fas fa-shield-alt"></i> Paint Protection Film
          </h1>
          <p style={{ maxWidth: '850px', margin: '0 auto', color: '#aaa', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Our Paint Protection Film (PPF) collection is engineered to deliver unmatched protection, clarity, and durability for modern vehicles.
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
        {/* Product Grid */}
        <div className="product-grid fade-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', margin: '60px 0' }}>
          {products.map((product, index) => (
            <div key={index} onClick={() => handleProductClick(product.url)} style={{ background: '#0C0C12', borderRadius: '32px', overflow: 'hidden', transition: 'all 0.35s ease', borderBottom: '3px solid transparent', cursor: 'pointer' }}>
              <div style={{ height: '260px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${product.imgUrl}')`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: product.badge === 'SATIN FINISH' ? '#8A8A8A' : '#E50914', padding: '6px 14px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {product.badge}
                </div>
              </div>
              <div style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px', color: '#E50914' }}>{product.name}</h3>
                <p style={{ color: '#bbb', lineHeight: '1.6', marginBottom: '20px' }}>{product.shortDesc}</p>
                <button style={{ background: 'transparent', border: '1.5px solid #E50914', padding: '10px 24px', borderRadius: '30px', fontWeight: 600, fontSize: '0.8rem', color: '#E50914', cursor: 'pointer' }}>View Details →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Section */}
        <div className="tech-section fade-section" style={{ background: 'linear-gradient(145deg, #0C0C12, #08080c)', borderRadius: '48px', padding: '60px', margin: '60px 0', border: '1px solid rgba(229,9,20,0.2)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E50914', textAlign: 'center' }}>Advanced Polymer Technology</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}><i className="fas fa-magic" style={{ fontSize: '2.5rem', color: '#E50914', marginBottom: '15px' }}></i><h3>Self-Healing Top Coat</h3><p>Minor scratches disappear with heat exposure</p></div>
            <div style={{ textAlign: 'center', padding: '20px' }}><i className="fas fa-sun" style={{ fontSize: '2.5rem', color: '#E50914', marginBottom: '15px' }}></i><h3>UV & Oxidation Resistance</h3><p>Blocks harmful UV rays preventing fading</p></div>
            <div style={{ textAlign: 'center', padding: '20px' }}><i className="fas fa-water" style={{ fontSize: '2.5rem', color: '#E50914', marginBottom: '15px' }}></i><h3>Hydrophobic Properties</h3><p>Repels water and contaminants</p></div>
          </div>
        </div>

        {/* Finish Options */}
        <div className="finish-section fade-section" style={{ margin: '60px 0' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', color: '#E50914', marginBottom: '20px' }}>Available Finishes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{ background: '#0F0F15', borderRadius: '28px', padding: '30px', textAlign: 'center', border: '1px solid rgba(229,9,20,0.2)' }}><i className="fas fa-sun" style={{ fontSize: '2rem', color: '#E50914', marginBottom: '15px' }}></i><h3>High Gloss</h3><p>Crystal-clear finish that enhances paint depth</p></div>
            <div style={{ background: '#0F0F15', borderRadius: '28px', padding: '30px', textAlign: 'center', border: '1px solid rgba(229,9,20,0.2)' }}><i className="fas fa-moon" style={{ fontSize: '2rem', color: '#E50914', marginBottom: '15px' }}></i><h3>Satin Matte</h3><p>Stealth, luxurious satin finish</p></div>
          </div>
        </div>

        {/* Warranty Section */}
        <div className="warranty-section fade-section" style={{ background: 'rgba(229,9,20,0.05)', borderRadius: '40px', padding: '40px', textAlign: 'center', margin: '40px 0' }}>
          <i className="fas fa-shield-alt" style={{ fontSize: '3rem', color: '#E50914', marginBottom: '15px' }}></i>
          <h3>Manufacturer Warranty</h3>
          <p>All Zeo Shields PPF products are backed by a comprehensive manufacturer warranty.</p>
        </div>

        {/* CTA Section */}
        <div className="cta-section fade-section" style={{ background: '#0B0B10', borderRadius: '48px', padding: '60px 40px', textAlign: 'center', margin: '60px 0', border: '1px solid rgba(229,9,20,0.2)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Need Help Choosing?</h2>
          <p style={{ marginBottom: '30px' }}>Our global experts are ready to help you find the perfect PPF for your vehicle.</p>
          <a href="/contact" className="btn-primary" style={{ background: '#FFFFFF', padding: '14px 36px', borderRadius: '40px', fontWeight: 'bold', color: '#010101', textDecoration: 'none', display: 'inline-block' }}>Contact Distributors</a>
        </div>
      </div>

      <style>{`
        .fade-section { opacity: 0; transform: translateY(30px); transition: opacity 0.7s, transform 0.7s; }
        .fade-section.visible { opacity: 1; transform: translateY(0); }
        .product-grid > div:hover { transform: translateY(-8px); border-bottom-color: #E50914; box-shadow: 0 20px 35px -15px rgba(229,9,20,0.4); }
        .btn-primary:hover { background: #E0E0E0; transform: translateY(-3px); }
      `}</style>
    </>
  );
};