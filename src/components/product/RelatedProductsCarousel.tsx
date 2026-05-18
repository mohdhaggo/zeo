import React, { useState } from 'react';

interface RelatedProduct {
  id: number;
  name: string;
  tag: string;
  image: string;
  url: string;
}

interface RelatedProductsCarouselProps {
  products: RelatedProduct[];
  currentProductName: string;
}

export const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({ products, currentProductName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const filteredProducts = products.filter(p => p.name !== currentProductName);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-section fade-section" style={{
      margin: '80px 0',
      background: 'linear-gradient(135deg, #0a0a0f, #050508)',
      borderRadius: '48px',
      padding: '60px 40px',
      border: '1px solid rgba(229,9,20,0.2)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#E50914', fontSize: '2rem' }}>
        <i className="fas fa-layer-group"></i> Explore Our PPF Collection
      </h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', alignItems: 'center', minHeight: '320px' }}>
        {filteredProducts.map((product, idx) => {
          const isActive = idx === currentIndex;
          const scale = isActive ? 1 : 0.85;
          const opacity = Math.abs(idx - currentIndex) <= 1 ? 1 : 0.4;
          
          return (
            <div
              key={product.id}
              onClick={() => window.location.href = product.url}
              style={{
                position: 'relative',
                width: '350px',
                height: '350px',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#0F0F15',
                border: '1px solid rgba(229,9,20,0.2)',
                transition: 'all 0.4s ease',
                transform: `scale(${scale})`,
                opacity
              }}
            >
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, #000000cc, transparent)',
                padding: '20px'
              }}>
                <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '5px' }}>{product.name}</h4>
                <p style={{ color: '#E50914', fontSize: '0.75rem' }}>{product.tag}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="carousel-controls" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <button onClick={prevSlide} style={{
          background: '#0F0F15',
          border: '1px solid #E50914',
          color: '#E50914',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '1.2rem'
        }}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button onClick={nextSlide} style={{
          background: '#0F0F15',
          border: '1px solid #E50914',
          color: '#E50914',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '1.2rem'
        }}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="dot-indicators" style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '30px 0 20px' }}>
        {filteredProducts.map((_, idx) => (
          <div
            key={idx}
            onClick={() => goToSlide(idx)}
            style={{
              width: idx === currentIndex ? '60px' : '40px',
              height: '4px',
              background: idx === currentIndex ? '#E50914' : '#333',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
      
      <div style={{ display: 'flex', marginTop: '50px', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/products" className="btn-outline-silver">View All Products</a>
      </div>
    </div>
  );
};