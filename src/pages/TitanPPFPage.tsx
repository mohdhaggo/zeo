import React, { useEffect, useMemo, useRef, useState } from 'react';

const galleryImages = [
  { src: '/01-titan-ppf-white.webp', alt: 'TITAN PPF - Maximum Protection Paint Protection Film' },
  { src: '/02-titan-ppf-white.webp', alt: 'Premium vehicle with TITAN PPF installed' },
  { src: '/03-titan-ppf-white.webp', alt: 'Self-healing technology demonstration' },
  { src: '/04-titan-ppf-white.webp', alt: 'High-gloss finish showcase' }
];

const ppfProducts = [
  { id: 1, name: 'TITAN PPF', tag: '10 Year Warranty', image: '/01-titan-ppf-white.webp', url: '/titan-ppf' },
  { id: 2, name: 'ULTRA PPF', tag: '5 Year Warranty', image: '/01-ultra-ppf-red.webp', url: '/ultra-ppf' },
  { id: 3, name: 'TITAN SATIN PPF', tag: 'Satin Finish', image: '/01-stain-ppf-blue.webp', url: '/titan-satin-ppf' }
];

export const TitanPPFPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<number | null>(null);

  useEffect(() => {
    document.title = 'TITAN PPF | Zeo Shields - Maximum Protection Paint Protection Film';
    const descriptionTag = document.querySelector("meta[name='description']");
    const keywordsTag = document.querySelector("meta[name='keywords']");

    if (descriptionTag) {
      descriptionTag.setAttribute('content', 'TITAN PPF - flagship paint protection film with 10-year warranty. Maximum impact resistance, self-healing technology, and multiple thickness options for ultimate vehicle protection.');
    }
    if (keywordsTag) {
      keywordsTag.setAttribute('content', 'TITAN PPF, Paint Protection Film, 10-year warranty PPF, Self-healing PPF, Car paint protection, Luxury car PPF');
    }

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
    const updateWidth = () => {
      if (imageContainerRef.current) setContainerWidth(imageContainerRef.current.offsetWidth);
    };
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (imageContainerRef.current) resizeObserver.observe(imageContainerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    autoplayRef.current = window.setInterval(() => {
      if (!isHovering) setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, [isHovering]);

  const openFullscreenImage = (image: { src: string; alt: string }) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreenModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  const calculateGap = (width: number) => {
    const minWidth = 1024;
    const maxWidth = 1456;
    const minGap = 60;
    const maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth) return maxGap;
    return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
  };

  const getImageStyle = (index: number) => {
    const gap = calculateGap(containerWidth || 1200);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + galleryImages.length) % galleryImages.length === index;
    const isRight = (activeIndex + 1) % galleryImages.length === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto' as const,
        transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)'
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto' as const,
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto' as const,
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none' as const,
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)'
    };
  };

  const visibleProducts = useMemo(() => {
    return ppfProducts.map((_, idx) => ppfProducts[(currentIndex + idx) % ppfProducts.length]);
  }, [currentIndex]);

  return (
    <>
      <div className="container">
        <div className="product-hero fade-section">
          <div className="product-badge"><i className="fas fa-fire"></i> FLAGSHIP PROTECTION | 10-YEAR WARRANTY</div>
          <h1>TITAN PPF</h1>
          <p style={{ color: '#aaa' }}>Maximum protection paint protection film with 10-year durability for luxury and high-performance vehicles.</p>
        </div>

        <div className="product-layout fade-section">
          <div className="product-gallery">
            <div
              className="image-container"
              ref={imageContainerRef}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {galleryImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image.src}
                  alt={image.alt}
                  className="carousel-image"
                  style={getImageStyle(idx)}
                  onClick={(e) => { e.stopPropagation(); openFullscreenImage(image); }}
                />
              ))}
            </div>

            <div className="carousel-dots">
              {galleryImages.map((_, idx) => (
                <div key={idx} className={`dot ${idx === activeIndex ? 'active' : ''}`} onClick={() => setActiveIndex(idx)} />
              ))}
            </div>

            <div className="carousel-arrows">
              <button className="carousel-arrow" onClick={() => setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)} aria-label="Previous image">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="carousel-arrow" onClick={() => setActiveIndex((prev) => (prev + 1) % galleryImages.length)} aria-label="Next image">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div className="product-info">
            <p><strong>TITAN PPF</strong> is the flagship solution for those who demand maximum protection and premium performance. Designed using cutting-edge material technology, this film offers superior durability with multiple thickness options, ensuring protection against rocks, scratches, and environmental hazards.</p>
            <p>The advanced self-healing top coat automatically repairs minor swirl marks and scratches when exposed to heat, keeping your vehicle looking brand new at all times.</p>
            <p>With UV and stain resistance, TITAN PPF prevents discoloration and protects your paint from harsh sunlight and contaminants—making it ideal for extreme climates across the Middle East, Asia, and global markets.</p>
            <p>Backed by a 10-year warranty, TITAN PPF is built for long-term reliability, making it the ultimate choice for luxury and high-performance vehicles.</p>

            <div className="thickness-options">
              <span>7.5 MIL</span>
              <span>8.5 MIL</span>
              <span>9.5 MIL</span>
            </div>

            <div className="tech-note">
              <i className="fas fa-magic"></i>
              <p style={{ marginTop: '8px' }}><strong>Self-Healing Technology</strong> — Minor scratches disappear with heat exposure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="benefits-warranty-grid fade-section">
          <div className="key-benefits">
            <h3><i className="fas fa-check-circle"></i> Key Benefits</h3>
            <ul>
              <li><i className="fas fa-shield-alt"></i> Maximum impact resistance against rocks and debris</li>
              <li><i className="fas fa-magic"></i> Advanced self-healing surface technology</li>
              <li><i className="fas fa-sun"></i> UV and stain protection for long-lasting paint finish</li>
              <li><i className="fas fa-gem"></i> Long-lasting optical clarity and gloss</li>
              <li><i className="fas fa-certificate"></i> 10-year warranty for peace of mind</li>
            </ul>
          </div>

          <div className="warranty-box">
            <i className="fas fa-shield-alt"></i>
            <h3>10-Year Warranty</h3>
            <p>Built for long-term reliability � the ultimate choice for luxury and high-performance vehicles. Backed by Zeo Shields global warranty.</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '25px' }}>
              <a href="/warranty" className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>Validate Warranty</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="carousel-section fade-section">
          <h2><i className="fas fa-layer-group"></i> Explore Our PPF Collection</h2>

          <div className="carousel-controls">
            <div id="carousel-root" className="flex-center">
              {visibleProducts.map((product) => (
                <div key={product.id} className="fan-card" onClick={() => window.location.href = product.url}>
                  <img src={product.image} alt={product.name} onError={(e) => { const target = e.target as HTMLImageElement; target.src = 'https://picsum.photos/id/104/300/300'; }} />
                  <div className="fan-card-overlay">
                    <h4>{product.name}</h4>
                    <p>{product.tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dot-indicators">
            {ppfProducts.map((_, idx) => (
              <div key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(idx)} />
            ))}
          </div>

          <div className="carousel-navigation">
            <button className="carousel-btn" onClick={() => setCurrentIndex((prev) => (prev - 1 + ppfProducts.length) % ppfProducts.length)}><i className="fas fa-chevron-left"></i></button>
            <button className="carousel-btn" onClick={() => setCurrentIndex((prev) => (prev + 1) % ppfProducts.length)}><i className="fas fa-chevron-right"></i></button>
          </div>

          <div style={{ display: 'flex', marginTop: '50px', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/products" className="btn-outline-silver">View All Products</a>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="cta-section fade-section">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Need Help Choosing?</h2>
          <p style={{ marginBottom: '30px' }}>Our global experts are ready to help you find the perfect PPF for your vehicle.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" className="btn-primary">Contact Distributors</a>
          </div>
        </div>
      </div>

      {isModalOpen && selectedImage && (
        <div className="fullscreen-modal active" onClick={closeFullscreenModal}>
          <div className="close-modal" onClick={(e) => { e.stopPropagation(); closeFullscreenModal(); }}><i className="fas fa-times"></i></div>
          <img src={selectedImage.src} alt={selectedImage.alt} className="modal-image" onClick={(e) => e.stopPropagation()} />
          <div className="modal-caption">{selectedImage.alt}</div>
        </div>
      )}

      <style>{`
        .product-hero { padding: 60px 0 40px; text-align: center; }
        .product-hero h1 { font-size: 3rem; background: linear-gradient(135deg, #FFFFFF, #E50914); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 15px; }
        .product-badge { display: inline-block; background: rgba(229,9,20,0.2); padding: 6px 16px; border-radius: 30px; font-size: 0.8rem; margin-bottom: 20px; border-left: 3px solid #E50914; font-family: 'Orbitron', monospace; }
        .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin: 40px 0; align-items: start; }
        .product-gallery { text-align: center; position: relative; }
        .image-container { position: relative; width: 100%; height: 26rem; perspective: 1000px; cursor: pointer; }
        .carousel-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 1.5rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); border: 1px solid rgba(229,9,20,0.4); transition: all 0.8s cubic-bezier(.4,2,.3,1); }
        .carousel-dots, .dot-indicators { display: flex; justify-content: center; gap: 0.75rem; margin-top: 1rem; }
        .dot { width: 2rem; height: 0.25rem; background: #333; border-radius: 0.25rem; cursor: pointer; transition: all 0.3s; }
        .dot.active { background: #E50914; width: 3rem; }
        .carousel-arrows, .carousel-controls { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .carousel-arrow, .carousel-btn { width: 2.7rem; height: 2.7rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.3s, transform 0.2s; border: none; background-color: #141414; color: #f1f1f7; }
        .carousel-arrow:hover, .carousel-btn:hover { transform: scale(1.05); background-color: #E50914; color: white; }
        .product-info p { line-height: 1.7; color: #bbb; margin-bottom: 20px; }
        .thickness-options { display: flex; gap: 15px; justify-content: center; margin: 20px 0; flex-wrap: wrap; }
        .thickness-options span { background: #1a1a1a; padding: 8px 20px; border-radius: 30px; font-size: 0.9rem; border: 1px solid #E50914; font-family: 'Orbitron', monospace; }
        .tech-note { background: linear-gradient(145deg, #0F0F15, #0A0A0F); border-radius: 24px; padding: 20px; margin: 20px 0 0; text-align: center; border: 1px solid rgba(229,9,20,0.3); }
        .tech-note i { font-size: 1.5rem; color: #E50914; }
        .benefits-warranty-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0 20px; }
        .key-benefits { background: #0C0C12; border-radius: 28px; padding: 28px; border: 1px solid rgba(229,9,20,0.2); height: 100%; }
        .key-benefits h3 { color: #E50914; margin-bottom: 20px; font-size: 1.4rem; display: flex; align-items: center; gap: 12px; }
        .key-benefits ul { list-style: none; padding: 0; }
        .key-benefits li { padding: 12px 0; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #222; font-size: 0.95rem; }
        .key-benefits li:last-child { border-bottom: none; }
        .key-benefits li i { color: #E50914; width: 28px; font-size: 1.1rem; }
        .warranty-box { background: rgba(229,9,20,0.08); border-radius: 28px; padding: 28px; text-align: center; border: 1px solid rgba(229,9,20,0.3); height: 100%; display: flex; flex-direction: column; justify-content: center; transition: all 0.3s ease; }
        .warranty-box:hover { transform: translateY(-5px); border-color: rgba(229,9,20,0.6); box-shadow: 0 15px 35px rgba(229,9,20,0.15); }
        .warranty-box i { font-size: 2.8rem; color: #E50914; margin-bottom: 15px; }
        .warranty-box h3 { font-size: 1.5rem; margin: 15px 0 12px; color: #fff; }
        .warranty-box p { color: #bbb; line-height: 1.5; font-size: 0.95rem; }
        .carousel-section { margin: 80px 0; background: linear-gradient(135deg, #0a0a0f, #050508); border-radius: 48px; padding: 60px 40px; border: 1px solid rgba(229,9,20,0.2); }
        .carousel-section h2 { text-align: center; margin-bottom: 40px; color: #E50914; font-size: 2rem; }
        .flex-center { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: center; min-height: 320px; width: 100%; }
        .fan-card { position: relative; width: 100%; height: 320px; border-radius: 24px; overflow: hidden; cursor: pointer; background: #0F0F15; border: 1px solid rgba(229,9,20,0.2); transition: all 0.3s; }
        .fan-card:hover { transform: scale(1.03); border-color: #E50914; }
        .fan-card img { width: 100%; height: 100%; object-fit: cover; }
        .fan-card-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, #000000cc, transparent); padding: 20px; }
        .fan-card-overlay h4 { color: white; font-size: 1.1rem; margin-bottom: 5px; }
        .fan-card-overlay p { color: #E50914; font-size: 0.75rem; margin: 0; }
        .carousel-controls { margin-top: 40px; width: 100%; }
        .carousel-navigation { display: flex; justify-content: center; gap: 20px; margin-top: 40px; width: 100%; }
        .carousel-btn { background: #141414; border: none; color: #f1f1f7; width: 2.7rem; height: 2.7rem; border-radius: 50%; cursor: pointer; transition: background-color 0.3s, transform 0.2s; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }
        .carousel-btn:hover { transform: scale(1.05); background-color: #E50914; color: white; }
        .dot-indicators { display: flex; justify-content: center; gap: 12px; margin: 30px 0 20px; }
        .view-all { text-align: center; margin-top: 50px; }
        .cta-section { background: #0B0B10; border-radius: 48px; padding: 60px 40px; text-align: center; margin: 60px 0; border: 1px solid rgba(229,9,20,0.2); }
        .fullscreen-modal { display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.96); z-index: 2000; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        .close-modal { position: absolute; top: 28px; right: 32px; background: rgba(20,20,20,0.9); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #E50914; cursor: pointer; transition: all 0.25s; border: 1px solid rgba(229,9,20,0.6); }
        .close-modal:hover { background: #E50914; color: white; transform: scale(1.05); border-color: white; }
        .modal-image { max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 1rem; box-shadow: 0 25px 50px rgba(0,0,0,0.5); border: 2px solid rgba(229,9,20,0.5); transition: transform 0.2s; }
        .modal-caption { position: absolute; bottom: 30px; left: 0; right: 0; text-align: center; color: #eee; font-family: 'Orbitron', monospace; background: rgba(0,0,0,0.7); padding: 12px 20px; width: fit-content; margin: 0 auto; border-radius: 60px; font-size: 0.9rem; backdrop-filter: blur(10px); pointer-events: none; letter-spacing: 1px; }
        @media (max-width: 900px) {
          .product-layout, .benefits-warranty-grid { grid-template-columns: 1fr; }
          .carousel-controls { flex-direction: column; }
          .fan-card { width: 220px; height: 220px; }
          .image-container { height: 18rem; }
          .carousel-section { padding: 30px 20px; }
          .product-hero h1 { font-size: 2rem; }
          .thickness-options { flex-direction: column; }
          .cta-section { padding: 40px 24px; }
        }
      `}</style>
    </>
  );
};
