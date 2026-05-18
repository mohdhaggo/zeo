import React from 'react';

export const ProductGrid: React.FC = () => {
  const products = [
    {
      name: 'TITAN PPF',
      shortDesc: 'Maximum protection PPF with 10-year durability',
      imgUrl: '/01-titan-ppf-white.webp',
      badge: '10 YEAR WARRANTY'
    },
    {
      name: 'ULTRA PPF',
      shortDesc: 'Reliable protection with advanced technology',
      imgUrl: '/01-ultra-ppf-red.webp',
      badge: '5 YEAR WARRANTY'
    },
    {
      name: 'TITAN SATIN PPF',
      shortDesc: 'Premium satin finish with ultimate protection',
      imgUrl: '/01-stain-ppf-blue.webp',
      badge: 'SATIN FINISH'
    }
  ];

  const handleProductClick = (productName: string) => {
    const urlMap: Record<string, string> = {
      'TITAN PPF': '/titan-ppf',
      'ULTRA PPF': '/ultra-ppf',
      'TITAN SATIN PPF': '/titan-satin-ppf'
    };
    window.location.href = urlMap[productName] || '#';
  };

  return (
    <div className="product-grid fade-section" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '40px',
      margin: '60px 0'
    }}>
      {products.map((product, index) => (
        <div 
          key={index}
          onClick={() => handleProductClick(product.name)}
          style={{
            background: '#0C0C12',
            borderRadius: '32px',
            overflow: 'hidden',
            transition: 'all 0.35s ease',
            borderBottom: '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <div style={{
            height: '260px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url('${product.imgUrl}')`,
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: product.badge === 'SATIN FINISH' ? '#8A8A8A' : '#E50914',
              padding: '6px 14px',
              borderRadius: '30px',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {product.badge}
            </div>
          </div>
          <div style={{ padding: '28px 24px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px', color: '#E50914' }}>{product.name}</h3>
            <p style={{ color: '#bbb', lineHeight: '1.6', marginBottom: '20px' }}>{product.shortDesc}</p>
            <button style={{
              background: 'transparent',
              border: '1.5px solid #E50914',
              padding: '10px 24px',
              borderRadius: '30px',
              fontWeight: 600,
              fontSize: '0.8rem',
              color: '#E50914',
              cursor: 'pointer'
            }}>
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};