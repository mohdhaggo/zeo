import React, { useEffect, useMemo, useRef, useState } from 'react';

export const TitanSatinPPFPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<number | null>(null);

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
    }, 2000);
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, [isHovering]);

  const galleryImages = [
    { src: "/01-stain-ppf-blue.webp", alt: "TITAN SATIN PPF - Elegant Satin Finish Paint Protection" },
    { src: "/02-stain-ppf-blue.webp", alt: "Premium vehicle with TITAN SATIN PPF installed" },
    { src: "/03-stain-ppf-blue.webp", alt: "Satin finish texture closeup" },
    { src: "/04-stain-ppf-blue.webp", alt: "Self-healing technology demonstration" }
  ];

  const ppfProducts = [
    { id: 1, name: "TITAN PPF", tag: "10 Year Warranty", image: "/01-titan-ppf-white.webp", url: "/titan-ppf" },
    { id: 2, name: "ULTRA PPF", tag: "5 Year Warranty", image: "/01-ultra-ppf-red.webp", url: "/ultra-ppf" },
    { id: 3, name: "TITAN SATIN PPF", tag: "Satin Finish", image: "/01-stain-ppf-blue.webp", url: "/titan-satin-ppf" }
  ];

  const visibleProducts = useMemo(() => {
    return ppfProducts.map((_, idx) => ppfProducts[(currentIndex + idx) % ppfProducts.length]);
  }, [currentIndex]);

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

  return (
    <>
      <div className="titan-satin-container" style={{ 
        maxWidth: '1300px', 
        margin: '0 auto', 
        padding: '0 20px',
        width: '100%',
        textAlign: 'left',
        overflowX: 'hidden'
      }}>
        {/* Product Hero */}
        <div className="product-hero fade-section" style={{ textAlign: 'left', padding: 'clamp(40px, 8vw, 60px) 0 clamp(30px, 5vw, 40px)' }}>
          <div className="product-badge" style={{ 
            display: 'inline-block', 
            textAlign: 'left',
            background: 'rgba(229,9,20,0.2)', 
            padding: '6px 16px', 
            borderRadius: '30px', 
            fontSize: 'clamp(0.7rem, 3vw, 0.8rem)', 
            marginBottom: '50px', 
            borderLeft: '3px solid #E50914' 
          }}>
            SATIN FINISH | 10-YEAR WARRANTY
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3rem)', 
            background: 'linear-gradient(135deg, #FFFFFF, #E50914)', 
            WebkitBackgroundClip: 'text', 
            backgroundClip: 'text', 
            color: 'transparent', 
            marginBottom: '15px',
            lineHeight: '1.2'
          }}>TITAN SATIN PPF</h1>
          <p style={{ 
            color: '#aaa',
            fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
            padding: '0 15px'
          }}>Premium satin finish paint protection that transforms glossy paint into a smooth, stealth appearance.</p>
        </div>

        {/* Product Layout */}
        <div className="product-layout fade-section" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 'clamp(30px, 6vw, 60px)', 
          margin: 'clamp(30px, 6vw, 40px) 0', 
          alignItems: 'start' 
        }}>
          {/* Image Gallery */}
          <div className="product-gallery">
            <div
              className="image-container"
              ref={imageContainerRef}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{ cursor: 'pointer' }}
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

          {/* Product Info */}
          <div>
            <p style={{ 
              lineHeight: '1.7', 
              color: '#bbb', 
              marginBottom: '20px',
              fontSize: 'clamp(0.9rem, 3.5vw, 1rem)'
            }}>TITAN SATIN PPF combines premium protection with a unique satin finish, giving your vehicle a bold and refined appearance. Designed for those who want to stand out, this film transforms glossy paint into a smooth satin texture while maintaining full protection against rocks, scratches, and environmental hazards.</p>
            <p style={{ 
              lineHeight: '1.7', 
              color: '#bbb', 
              marginBottom: '20px',
              fontSize: 'clamp(0.9rem, 3.5vw, 1rem)'
            }}>Built with advanced self-healing technology, the surface eliminates minor scratches and swirl marks, ensuring a consistent and clean finish over time. The satin finish creates a subtle, non-reflective appearance that exudes sophistication and stealth.</p>
            <p style={{ 
              lineHeight: '1.7', 
              color: '#bbb', 
              marginBottom: '20px',
              fontSize: 'clamp(0.9rem, 3.5vw, 1rem)'
            }}>The film also offers UV and stain resistance, protecting your vehicle from fading, discoloration, and environmental contaminants—perfect for extreme weather conditions across the Middle East, Asia, and global markets.</p>
            <div className="thickness-options" style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center', 
              margin: '20px 0',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                background: '#1a1a1a', 
                padding: 'clamp(6px, 2vw, 8px) clamp(15px, 4vw, 20px)', 
                borderRadius: '30px', 
                border: '1px solid #E50914',
                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)'
              }}>7.5 MIL</span>
            </div>
            <div style={{ 
              background: 'linear-gradient(145deg, #0F0F15, #0A0A0F)', 
              borderRadius: 'clamp(20px, 4vw, 24px)', 
              padding: 'clamp(15px, 4vw, 20px)', 
              textAlign: 'center', 
              border: '1px solid rgba(229,9,20,0.3)' 
            }}>
              <i className="fas fa-palette" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: '#E50914' }}></i>
              <p style={{ marginTop: '8px', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)' }}>
                <strong>Elegant Satin Transformation</strong> — Converts gloss paint to a smooth, stealth satin finish
              </p>
            </div>
          </div>
        </div>

        {/* Benefits & Warranty Grid */}
        <div className="benefits-warranty-grid fade-section" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'clamp(20px, 4vw, 30px)', 
          margin: 'clamp(20px, 4vw, 30px) 0 clamp(15px, 3vw, 20px)' 
        }}>
          <div style={{ 
            background: '#0C0C12', 
            borderRadius: 'clamp(24px, 4vw, 28px)', 
            padding: 'clamp(20px, 4vw, 28px)', 
            border: '1px solid rgba(229,9,20,0.2)' 
          }}>
            <h3 style={{ color: '#E50914', marginBottom: '20px', fontSize: 'clamp(1.2rem, 4vw, 1.4rem)' }}>Key Benefits</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ 
                padding: 'clamp(10px, 2vw, 12px) 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                borderBottom: '1px solid #222',
                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                flexWrap: 'wrap'
              }}>
                <i className="fas fa-palette" style={{ color: '#E50914', minWidth: '24px' }}></i> Elegant satin finish transformation
              </li>
              <li style={{ 
                padding: 'clamp(10px, 2vw, 12px) 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                borderBottom: '1px solid #222',
                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                flexWrap: 'wrap'
              }}>
                <i className="fas fa-shield-alt" style={{ color: '#E50914', minWidth: '24px' }}></i> Maximum impact protection
              </li>
              <li style={{ 
                padding: 'clamp(10px, 2vw, 12px) 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                borderBottom: '1px solid #222',
                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                flexWrap: 'wrap'
              }}>
                <i className="fas fa-magic" style={{ color: '#E50914', minWidth: '24px' }}></i> Advanced self-healing technology
              </li>
              <li style={{ 
                padding: 'clamp(10px, 2vw, 12px) 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                borderBottom: '1px solid #222',
                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                flexWrap: 'wrap'
              }}>
                <i className="fas fa-sun" style={{ color: '#E50914', minWidth: '24px' }}></i> UV and stain resistance
              </li>
              <li style={{ 
                padding: 'clamp(10px, 2vw, 12px) 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                flexWrap: 'wrap'
              }}>
                <i className="fas fa-certificate" style={{ color: '#E50914', minWidth: '24px' }}></i> 10-year warranty
              </li>
            </ul>
          </div>
          <div style={{ 
            background: 'rgba(229,9,20,0.08)', 
            borderRadius: 'clamp(24px, 4vw, 28px)', 
            padding: 'clamp(20px, 4vw, 28px)', 
            textAlign: 'center', 
            border: '1px solid rgba(229,9,20,0.3)' 
          }}>
            <i className="fas fa-shield-alt" style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', color: '#E50914', marginBottom: '15px' }}></i>
            <h3 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>10-Year Warranty</h3>
            <p style={{ fontSize: 'clamp(0.85rem, 3vw, 0.95rem)' }}>A long-term investment in both style and protection for those who want to stand out.</p>
            <a href="/warranty" className="btn-primary" style={{ 
              display: 'inline-block', 
              marginTop: '25px', 
              padding: 'clamp(8px, 2vw, 8px) clamp(20px, 5vw, 24px)', 
              background: '#E50914', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '40px',
              fontSize: 'clamp(0.85rem, 3vw, 0.95rem)'
            }}>Validate Warranty</a>
          </div>
        </div>

        {/* Related Products */}
        <div className="carousel-section fade-section">
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            textAlign: 'center',
            marginBottom: 'clamp(30px, 6vw, 40px)'
          }}>
            <i className="fas fa-layer-group"></i> Explore Our PPF Collection
          </h2>

          <div className="carousel-controls">
            <div className="flex-center">
              {visibleProducts.map((product) => (
                <div key={product.id} className="fan-card" onClick={() => window.location.href = product.url}>
                  <img src={product.image} alt={product.name} onError={(e) => { const target = e.target as HTMLImageElement; target.src = 'https://picsum.photos/id/104/300/300'; }} />
                  <div className="fan-card-overlay">
                    <h4 style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)' }}>{product.name}</h4>
                    <p style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)' }}>{product.tag}</p>
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
            <button className="carousel-btn" onClick={() => setCurrentIndex((prev) => (prev - 1 + ppfProducts.length) % ppfProducts.length)}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="carousel-btn" onClick={() => setCurrentIndex((prev) => (prev + 1) % ppfProducts.length)}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div style={{ display: 'flex', marginTop: '50px', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/products" className="btn-outline-silver" style={{
              padding: 'clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px)',
              fontSize: 'clamp(0.85rem, 3vw, 0.95rem)'
            }}>View All Products</a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section fade-section" style={{ 
          background: '#0B0B10', 
          borderRadius: 'clamp(32px, 6vw, 48px)', 
          padding: 'clamp(40px, 8vw, 60px) clamp(20px, 5vw, 40px)', 
          textAlign: 'center', 
          margin: 'clamp(40px, 8vw, 60px) 0' 
        }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', marginBottom: '20px' }}>Need Help Choosing?</h2>
          <p style={{ marginBottom: '30px', fontSize: 'clamp(0.9rem, 3.5vw, 1rem)' }}>Our global experts are ready to help you find the perfect PPF for your vehicle.</p>
          <a href="/contact" className="btn-primary" style={{ 
            background: '#FFFFFF', 
            padding: 'clamp(12px, 3vw, 14px) clamp(30px, 6vw, 36px)', 
            borderRadius: '40px', 
            fontWeight: 'bold', 
            color: '#010101', 
            textDecoration: 'none', 
            display: 'inline-block',
            fontSize: 'clamp(0.9rem, 3.5vw, 1rem)'
          }}>Contact Distributors</a>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && selectedImage && (
        <div className="fullscreen-modal active" onClick={closeFullscreenModal}>
          <div className="close-modal" onClick={(e) => { e.stopPropagation(); closeFullscreenModal(); }}>
            <i className="fas fa-times"></i>
          </div>
          <img src={selectedImage.src} alt={selectedImage.alt} className="modal-image" onClick={(e) => e.stopPropagation()} />
          <div className="modal-caption">{selectedImage.alt}</div>
        </div>
      )}

      <style>{`
        /* Base responsive styles */
        .titan-satin-container {
          width: 100%;
          box-sizing: border-box;
        }
        
        .fade-section { 
          opacity: 0; 
          transform: translateY(30px); 
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
        }
        
        .fade-section.visible { 
          opacity: 1; 
          transform: translateY(0); 
        }
        
        /* Product layout responsive */
        .product-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: clamp(30px, 6vw, 60px);
          margin: clamp(30px, 6vw, 40px) 0;
          align-items: start;
        }
        
        /* Gallery styles */
        .image-container {
          position: relative;
          width: 100%;
          height: clamp(280px, 50vw, 26rem);
          perspective: 1000px;
          cursor: pointer;
        }
        
        .carousel-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(229,9,20,0.4);
          transition: all 0.8s cubic-bezier(.4,2,.3,1);
        }
        
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .dot {
          width: 2rem;
          height: 0.25rem;
          background: #333;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .dot.active {
          background: #E50914;
          width: 3rem;
        }
        
        .carousel-arrows {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
          width: 100%;
        }
        
        .carousel-arrow {
          width: 2.7rem;
          height: 2.7rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
          border: none;
          background-color: #141414;
          color: #f1f1f7;
        }
        
        .carousel-arrow:hover {
          transform: scale(1.05);
          background-color: #E50914;
          color: white;
        }
        
        /* Benefits and warranty grid */
        .benefits-warranty-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: clamp(20px, 4vw, 30px);
          margin: clamp(20px, 4vw, 30px) 0 clamp(15px, 3vw, 20px);
        }
        
        /* Carousel section */
        .carousel-section {
          margin: clamp(40px, 8vw, 80px) 0;
          background: linear-gradient(135deg, #0a0a0f, #050508);
          border-radius: clamp(32px, 6vw, 48px);
          padding: clamp(30px, 6vw, 60px) clamp(20px, 5vw, 40px);
          border: 1px solid rgba(229,9,20,0.2);
        }
        
        .flex-center {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: clamp(20px, 4vw, 24px);
          align-items: center;
          min-height: 320px;
          width: 100%;
        }
        
        .fan-card {
          position: relative;
          width: 100%;
          height: clamp(280px, 45vw, 320px);
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          background: #0F0F15;
          border: 1px solid rgba(229,9,20,0.2);
          transition: all 0.3s;
        }
        
        .fan-card:hover {
          transform: scale(1.03);
          border-color: #E50914;
        }
        
        .fan-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .fan-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, #000000cc, transparent);
          padding: 20px;
        }
        
        .fan-card-overlay h4 {
          color: white;
          font-size: clamp(0.9rem, 3.5vw, 1.1rem);
          margin-bottom: 5px;
        }
        
        .fan-card-overlay p {
          color: #E50914;
          font-size: clamp(0.7rem, 2.5vw, 0.75rem);
          margin: 0;
        }
        
        .carousel-controls {
          margin-top: 40px;
          width: 100%;
        }
        
        .carousel-navigation {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
          width: 100%;
        }
        
        .carousel-btn {
          background: #141414;
          border: none;
          color: #f1f1f7;
          width: 2.7rem;
          height: 2.7rem;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .carousel-btn:hover {
          transform: scale(1.05);
          background-color: #E50914;
          color: white;
        }
        
        .dot-indicators {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 30px 0 20px;
        }
        
        /* CTA Section */
        .cta-section {
          background: #0B0B10;
          border-radius: clamp(32px, 6vw, 48px);
          padding: clamp(40px, 8vw, 60px) clamp(20px, 5vw, 40px);
          text-align: center;
          margin: clamp(40px, 8vw, 60px) 0;
          border: 1px solid rgba(229,9,20,0.2);
        }
        
        /* Fullscreen Modal */
        .fullscreen-modal {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.96);
          z-index: 2000;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }
        
        .close-modal {
          position: absolute;
          top: 28px;
          right: 32px;
          background: rgba(20,20,20,0.9);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #E50914;
          cursor: pointer;
          transition: all 0.25s;
          border: 1px solid rgba(229,9,20,0.6);
        }
        
        .close-modal:hover {
          background: #E50914;
          color: white;
          transform: scale(1.05);
          border-color: white;
        }
        
        .modal-image {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          border-radius: 1rem;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          border: 2px solid rgba(229,9,20,0.5);
          transition: transform 0.2s;
        }
        
        .modal-caption {
          position: absolute;
          bottom: 30px;
          left: 0;
          right: 0;
          text-align: center;
          color: #eee;
          font-family: 'Orbitron', monospace;
          background: rgba(0,0,0,0.7);
          padding: 12px 20px;
          width: fit-content;
          margin: 0 auto;
          border-radius: 60px;
          font-size: clamp(0.75rem, 3vw, 0.9rem);
          backdrop-filter: blur(10px);
          pointer-events: none;
          letter-spacing: 1px;
        }
        
        /* Thickness options */
        .thickness-options {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
          .titan-satin-container {
            padding: 0 15px !important;
          }
          
          .carousel-arrows,
          .carousel-navigation {
            margin-top: 20px;
          }
          
          .carousel-arrow,
          .carousel-btn {
            width: 2.2rem;
            height: 2.2rem;
            font-size: 0.9rem;
          }
          
          .flex-center {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .fan-card {
            height: 280px;
          }
          
          .dot {
            width: 1.5rem;
          }
          
          .dot.active {
            width: 2rem;
          }
        }
        
        /* Small mobile devices */
        @media (max-width: 480px) {
          .titan-satin-container {
            padding: 0 12px !important;
          }
          
          .image-container {
            height: 250px;
          }
          
          .carousel-dots {
            gap: 0.5rem;
          }
          
          .carousel-arrows {
            gap: 15px;
          }
          
          .benefits-warranty-grid {
            gap: 20px;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .flex-center {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        /* Landscape mode on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .image-container {
            height: 300px;
          }
          
          .flex-center {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .carousel-arrow:active,
          .carousel-btn:active,
          .fan-card:active {
            transform: scale(0.98);
          }
        }
        
        /* Ensure all images are responsive */
        img {
          max-width: 100%;
          height: auto;
        }
        
        /* Prevent horizontal scroll */
        html, body {
          overflow-x: hidden;
          width: 100%;
        }
        
        /* Smooth scrolling on iOS */
        .titan-satin-container {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Performance optimization */
        @media (prefers-reduced-motion: reduce) {
          .fade-section,
          .carousel-image,
          .fan-card {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};