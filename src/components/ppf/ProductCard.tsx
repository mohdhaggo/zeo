import React from 'react';
import { useModal } from '../../hooks/useModal';
import { ProductModal } from '../common/ProductModal';

interface PPFProduct {
  name: string;
  shortDesc: string;
  specs: string;
  warranty: string;
  imgUrl: string;
  longDesc: string;
  color: string;
  detailUrl: string;
  badge?: string;
  features: string[];
}

interface ProductCardProps {
  product: PPFProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isOpen, selectedProduct, openModal, closeModal } = useModal();

  const handleCardClick = () => {
    openModal({
      name: product.name,
      shortDesc: product.shortDesc,
      specs: product.specs,
      warranty: product.warranty,
      imgUrl: product.imgUrl,
      longDesc: product.longDesc,
      category: 'ppf',
      color: product.color,
      detailUrl: product.detailUrl
    });
  };

  return (
    <>
      <div 
        className="product-card" 
        onClick={handleCardClick}
        style={{
          background: '#0C0C12',
          borderRadius: '32px',
          overflow: 'hidden',
          transition: 'all 0.35s ease',
          borderBottom: '3px solid transparent',
          cursor: 'pointer'
        }}
      >
        <div 
          className="product-img" 
          style={{
            height: '260px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url('${product.imgUrl}')`,
            position: 'relative'
          }}
        >
          {product.badge && (
            <div className="product-badge" style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: product.badge === 'SATIN FINISH' ? '#8A8A8A' : '#E50914',
              padding: '6px 14px',
              borderRadius: '30px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              fontFamily: "'Orbitron', monospace"
            }}>
              {product.badge}
            </div>
          )}
        </div>
        <div className="product-content" style={{ padding: '28px 24px' }}>
          <h3 className="product-title" style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#E50914',
            fontFamily: "'Orbitron', monospace"
          }}>{product.name}</h3>
          <div className="product-subtitle" style={{
            fontSize: '0.9rem',
            color: '#FF6B6B',
            marginBottom: '15px',
            fontWeight: 600
          }}>{product.shortDesc}</div>
          <p className="product-description" style={{
            color: '#bbb',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>{product.longDesc.substring(0, 120)}...</p>
          <div className="product-features" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {product.features.map((feature, index) => (
              <span key={index} style={{
                background: 'rgba(229,9,20,0.15)',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                color: '#FF6B6B'
              }}>
                <i className="fas fa-check-circle"></i> {feature}
              </span>
            ))}
          </div>
          <button className="btn-details" style={{
            background: 'transparent',
            border: '1.5px solid #E50914',
            padding: '10px 24px',
            borderRadius: '30px',
            fontWeight: 600,
            fontSize: '0.8rem',
            fontFamily: "'Orbitron', monospace",
            color: '#E50914',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}>
            View Details →
          </button>
        </div>
      </div>
      
      <ProductModal 
        isOpen={isOpen} 
        product={selectedProduct} 
        onClose={closeModal} 
      />
      
      <style>{`
        .product-card:hover {
          transform: translateY(-8px);
          border-bottom-color: #E50914;
          box-shadow: 0 20px 35px -15px rgba(229,9,20,0.4);
        }
        .btn-details:hover {
          background: #E50914;
          color: white;
          transform: translateX(5px);
        }
      `}</style>
    </>
  );
};