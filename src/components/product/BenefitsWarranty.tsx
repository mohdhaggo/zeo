import React from 'react';
import { Link } from 'react-router-dom';

interface BenefitsWarrantyProps {
  benefits: string[];
  warrantyYears: number;
}

export const BenefitsWarranty: React.FC<BenefitsWarrantyProps> = ({ benefits, warrantyYears }) => {
  return (
    <div className="benefits-warranty-grid fade-section" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
      margin: '30px 0 20px'
    }}>
      <div className="key-benefits" style={{
        background: '#0C0C12',
        borderRadius: '28px',
        padding: '28px',
        border: '1px solid rgba(229,9,20,0.2)',
        height: '100%'
      }}>
        <h3 style={{ color: '#E50914', marginBottom: '20px', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="fas fa-check-circle"></i> Key Benefits
        </h3>
        <ul style={{ listStyle: 'none' }}>
          {benefits.map((benefit, idx) => (
            <li key={idx} style={{
              padding: '12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: idx < benefits.length - 1 ? '1px solid #222' : 'none',
              fontSize: '0.95rem'
            }}>
              <i className="fas fa-shield-alt" style={{ color: '#E50914', width: '28px' }}></i>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="warranty-box" style={{
        background: 'rgba(229,9,20,0.08)',
        borderRadius: '28px',
        padding: '28px',
        textAlign: 'center',
        border: '1px solid rgba(229,9,20,0.3)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <i className="fas fa-shield-alt" style={{ fontSize: '2.8rem', color: '#E50914', marginBottom: '15px' }}></i>
        <h3 style={{ fontSize: '1.5rem', margin: '15px 0 12px', color: '#fff' }}>{warrantyYears}-Year Warranty</h3>
        <p style={{ color: '#bbb', lineHeight: '1.5', fontSize: '0.95rem' }}>
          Built for long-term reliability — the ultimate choice for luxury and high-performance vehicles. Backed by Zeo Shields global warranty.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '25px' }}>
          <Link to="/warranty" className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>Validate Warranty</Link>
        </div>
      </div>
    </div>
  );
};