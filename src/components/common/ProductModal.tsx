import React from 'react';
import { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, product, onClose }) => {
  if (!isOpen || !product) return null;

  const handleMoreDetails = () => {
    if (product.detailUrl) {
      window.location.href = product.detailUrl;
    }
  };

  return (
    <div className="modal show" style={{
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.96)',
      backdropFilter: 'blur(20px)',
      zIndex: 2000,
      alignItems: 'center',
      justifyContent: 'center'
    }} onClick={onClose}>
      <div className="modal-content" style={{
        background: '#0B0B10',
        maxWidth: '650px',
        width: '90%',
        borderRadius: '44px',
        padding: '32px',
        maxHeight: '85vh',
        overflowY: 'auto',
        borderTop: `5px solid ${product.color}`
      }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h2>{product.name}</h2>
          <span className="close-modal" onClick={onClose} style={{
            fontSize: '32px',
            cursor: 'pointer',
            transition: '0.2s'
          }}>&times;</span>
        </div>
        <img 
          src={product.imgUrl} 
          alt={product.name}
          className="modal-image" 
          style={{ width: '100%', borderRadius: '24px', marginBottom: '20px' }}
        />
        <p>
          <strong>{product.shortDesc}</strong>
          <br /><br />
          {product.longDesc}
        </p>
        <div className="modal-specs" style={{
          background: '#13131A',
          borderRadius: '20px',
          padding: '15px',
          margin: '15px 0'
        }}>
          <p><strong>Specifications:</strong> {product.specs}</p>
          <p><strong>Warranty:</strong> {product.warranty}</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            className="btn-modal" 
            onClick={handleMoreDetails}
            style={{
              background: '#E50914',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '40px',
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer',
              fontFamily: "'Orbitron', monospace"
            }}
          >
            📄 More Details
          </button>
          <button 
            className="btn-outline-silver" 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1.5px solid #CCCCCC',
              padding: '12px 32px',
              borderRadius: '40px',
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};