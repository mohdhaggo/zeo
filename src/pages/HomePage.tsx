import React, { useEffect, useRef, useState } from 'react';

const words = ['Protection', 'Performance', 'Durability', 'Innovation', 'Domination'];

export const HomePage: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const wordWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let wordIndex = 0;

    const interval = setInterval(() => {
      setIsAnimating(true);
      wordIndex = (wordIndex + 1) % words.length;
      setCurrentWord(words[wordIndex]);
      setTimeout(() => setIsAnimating(false), 400);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const setFixedWrapperWidth = () => {
      if (!wordWrapperRef.current) return;
      const wrapper = wordWrapperRef.current;
      const tempSpan = document.createElement('span');
      tempSpan.style.cssText = `visibility:hidden;position:absolute;font-size:4rem;font-weight:800;font-family:'Orbitron',monospace;white-space:nowrap;top:-9999px;left:-9999px;`;
      document.body.appendChild(tempSpan);
      let maxWidth = 0;
      words.forEach((word) => {
        tempSpan.textContent = word;
        const width = tempSpan.offsetWidth;
        if (width > maxWidth) maxWidth = width;
      });
      document.body.removeChild(tempSpan);
      wrapper.style.width = `${maxWidth + 15}px`;
    };

    setFixedWrapperWidth();
    window.addEventListener('resize', setFixedWrapperWidth);
    return () => window.removeEventListener('resize', setFixedWrapperWidth);
  }, []);

  const categories = [
    {
      name: 'PPF',
      color: '#E50914',
      image: '/PPF-cat.webp',
      description: 'Premium Paint Protection Film engineered for ultimate durability and performance worldwide.',
      url: '/ppf-cat'
    },
    {
      name: 'Window Tint',
      color: '#1E6BFF',
      image: '/wintint-cat.webp',
      description: 'COMING SOON.',
      url: '#',
      comingSoon: true
    },
    {
      name: 'Windshield Film',
      color: '#8A8A8A',
      image: '/windshield-cat.webp',
      description: 'COMING SOON.',
      url: '#',
      comingSoon: true
    }
  ];

  const products = [
    {
      name: 'TITAN PPF',
      desc: 'Maximum protection PPF with 10-year durability.',
      img: '/01-titan-ppf-white.webp',
      url: '/titan-ppf',
      badge: '10 YEAR WARRANTY',
      color: '#E50914'
    },
    {
      name: 'ULTRA PPF',
      desc: 'Reliable protection with advanced technology.',
      img: '/01-ultra-ppf-red.webp',
      url: '/ultra-ppf',
      badge: '5 YEAR WARRANTY',
      color: '#E50914'
    },
    {
      name: 'TITAN SATIN PPF',
      desc: 'Premium satin finish with ultimate protection.',
      img: '/01-stain-ppf-blue.webp',
      url: '/titan-satin-ppf',
      badge: 'SATIN FINISH',
      color: '#E50914'
    }
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-badge">
            <i className="fas fa-shield-haltered"></i> ENGINEERED FOR THE MIDDLE EAST, ASIA & BEYOND
          </div>
          <div className="animated-word-container">
            <span className="static-prefix">Ultimate</span>
            <div className="word-wrapper" ref={wordWrapperRef}>
              <span className="animated-word" style={{ animation: isAnimating ? 'wordFade 0.4s ease-out' : 'none' }}>
                {currentWord}
              </span>
            </div>
          </div>
          <p className="hero-subtitle">PPF, Window Tint & Windshield Film — engineered for extreme climates, high-speed roads, and global performance standards.</p>
          <div className="hero-buttons">
            <a href="/products" className="btn-primary">Explore Products</a>
            <a href="/contact" className="btn-outline-silver">Get In Touch</a>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="about-section fade-section">
          <h2>About Zeo Shields</h2>
          <p>We specialize in premium automotive protection solutions, delivering advanced Paint Protection Film (PPF), Window Tint, and Windshield Protection designed for performance, durability, and style. Driven by innovation and precision, our products serve automotive enthusiasts and fleets across the Middle East, Asia, and global markets — combining cutting-edge technology with long-term reliability.</p>
          <a href="/about" className="read-more">Read More →</a>
        </div>

        <h2 className="section-title fade-section">PROTECTION CATEGORIES</h2>
        <div className="category-grid fade-section">
          {categories.map((cat, idx) => (
            <div key={idx} className="cat-card" data-category={cat.name.toLowerCase()} onClick={() => cat.url !== '#' && (window.location.href = cat.url)} style={{ opacity: cat.comingSoon ? 0.7 : 1, cursor: cat.comingSoon ? 'not-allowed' : 'pointer' }}>
              <div className="card-img" style={{ backgroundImage: `url('${cat.image}')` }}></div>
              <div className="card-content">
                <div className="card-category" style={{ color: cat.color }}>{cat.name}</div>
                <p>{cat.description}</p>
                <span className="explore-link" style={{ color: cat.color }}>⟶ Explore {cat.name}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="page-title fade-section">🔰 OUR ARMORY</h2>
        <div className="product-grid fade-section">
          {products.map((product, idx) => (
            <div key={idx} className="product-card" onClick={() => window.location.href = product.url}>
              <div className="product-img">
                <img src={product.img} alt={product.name} />
                <div className="product-badge" style={{ background: product.badge === 'SATIN FINISH' ? '#8A8A8A' : '#E50914' }}>{product.badge}</div>
              </div>
              <div className="product-content">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-subtitle">{product.desc}</div>
                <button className="btn-details">View Details →</button>
              </div>
            </div>
          ))}
        </div>

        <div className="video-section fade-section">
          <div className="video-wrapper">
            <video autoPlay loop muted playsInline>
              <source src="/white_car_PPF.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="video-info-panel">
            <p><i className="fas fa-info-circle"></i> <strong>Watch our premium Paint Protection Film in action — engineered for global conditions.</strong></p>
          </div>
        </div>

        <h2 className="section-title fade-section">Why Choose Zeo Shields</h2>
        <div className="feature-grid fade-section">
          <div><i className="fas fa-shield-alt feature-icon"></i><h3>Maximum Protection</h3><p>Military-grade shield against all hazards</p></div>
          <div><i className="fas fa-layer-group feature-icon"></i><h3>Advanced Technology</h3><p>State-of-the-art nano coating</p></div>
          <div><i className="fas fa-sync-alt feature-icon"></i><h3>Self-Healing Top Coat</h3><p>Surface renews itself from minor scratches</p></div>
          <div><i className="fas fa-sun feature-icon"></i><h3>UV & Heat Resist</h3><p>Engineered for extreme climates globally</p></div>
        </div>

        <div className="cta-section fade-section">
          <h2>Need Help Choosing?</h2>
          <p>Our global experts are ready to help you find the perfect protection for your vehicle, no matter where you drive.</p>
          <a href="/contact" className="btn-primary">Contact Distributors</a>
        </div>
      </div>

      <style>{`
        .hero { min-height: 85vh; position: relative; display: flex; align-items: center; border-bottom: 2px solid #E50914; background: rgba(0, 0, 0, 0.7); }
        .hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('/zeo_landing.webp'); background-size: cover; background-position: center; z-index: 0; }
        .hero::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(95deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%); z-index: 1; }
        .hero .container { position: relative; z-index: 2; }
        .hero-badge { background: rgba(229,9,20,0.2); backdrop-filter: blur(8px); border-radius: 60px; padding: 8px 20px; display: inline-block; margin-bottom: 30px; font-weight: 600; border-left: 3px solid #E50914; }
        .animated-word-container { display: flex; align-items: baseline; flex-wrap: wrap; gap: 18px; margin-bottom: 20px; }
        .static-prefix { font-size: 4rem; font-weight: 800; font-family: 'Orbitron', monospace; color: white; line-height: 1.2; white-space: nowrap; }
        .animated-word { display: inline-block; font-weight: 800; font-family: 'Orbitron', monospace; background: linear-gradient(135deg, #E50914, #FF6B6B); -webkit-background-clip: text; background-clip: text; color: transparent; font-size: 4rem; line-height: 1.2; white-space: nowrap; }
        .hero-subtitle { font-size: 1.2rem; max-width: 580px; margin: 20px 0 30px; }
        .hero-buttons { display: flex; gap: 20px; flex-wrap: wrap; }
        @keyframes wordFade { 0% { opacity: 0; transform: translateY(-20px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        .about-section { background: #0B0B10; border-radius: 40px; padding: 48px; margin: 60px 0; border: 1px solid #222; }
        .about-section h2 { font-size: 2rem; margin-bottom: 20px; }
        .about-section p { font-size: 1.1rem; line-height: 1.6; }
        .read-more { margin-top: 20px; display: inline-block; color: #E50914; text-decoration: none; }
        .section-title { font-size: 2.5rem; text-align: center; margin: 60px 0 30px; }
        .page-title { font-size: 2rem; margin-bottom: 30px; border-left: 5px solid #E50914; padding-left: 20px; }
        .product-content { padding: 28px 24px; }
        .product-title { font-size: 1.6rem; font-weight: 700; margin-bottom: 8px; color: #E50914; font-family: 'Orbitron', monospace; }
        .product-subtitle { font-size: 0.9rem; color: #FF6B6B; margin-bottom: 15px; font-weight: 600; }
        .btn-details { background: transparent; border: 1.5px solid #E50914; padding: 10px 24px; border-radius: 30px; font-weight: 600; font-size: 0.8rem; font-family: 'Orbitron', monospace; color: #E50914; cursor: pointer; transition: all 0.3s ease; }
        .btn-details:hover { background: #E50914; color: white; transform: translateX(5px); }
        .video-section { margin: 80px 0; border-radius: 48px; overflow: hidden; background: linear-gradient(135deg, #0a0a0f, #050508); border: 1px solid rgba(229,9,20,0.3); }
        .video-wrapper video { width: 100%; display: block; }
        .video-info-panel { background: rgba(10, 10, 15, 0.8); border-radius: 24px; padding: 20px 25px; margin: 20px; border-left: 4px solid #E50914; }
        .video-info-panel i { color: #E50914; margin-right: 10px; }
        @media (max-width: 900px) { .static-prefix, .animated-word { font-size: 2.2rem; } .category-grid, .product-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};