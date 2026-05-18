import React, { useState } from 'react';
import { warrantyService } from '../../services/warrantyService';
import { WarrantyRecord } from '../../types/warranty';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  warrantyId: string;
  validWarranty: WarrantyRecord | null;
  onSuccess: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  warrantyId,
  validWarranty,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    country: '',
    purchaseDate: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.mobile || !formData.email || !formData.country || !formData.purchaseDate) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await warrantyService.registerWarranty({
        warrantyId,
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        purchaseCountry: formData.country,
        purchaseDate: formData.purchaseDate
      });
      
      alert(`✅ Warranty Successfully Registered!\n\nProduct: ${validWarranty?.productType}\nRegistered to: ${formData.fullName}\nRegistration Date: ${new Date().toLocaleString()}\nA confirmation email has been sent.`);
      onSuccess();
    } catch (error) {
      alert('Registration failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal-overlay active"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0F0F15',
          borderRadius: '36px',
          maxWidth: '520px',
          width: '90%',
          padding: '32px 30px',
          border: '1px solid rgba(229,9,20,0.5)',
          boxShadow: '0 30px 50px rgba(0,0,0,0.6)',
          position: 'relative'
        }}
      >
        <div 
          className="close-icon"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#aaa'
          }}
        >
          <i className="fas fa-times"></i>
        </div>
        
        <h3 style={{
          fontFamily: "'Orbitron', monospace",
          color: '#E50914',
          marginBottom: '24px',
          fontSize: '1.6rem',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <i className="fas fa-user-check"></i> Register Warranty
        </h3>
        
        <input
          type="text"
          placeholder="Full Name *"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 18px',
            margin: '10px 0',
            background: '#1A1A22',
            border: '1px solid #333',
            borderRadius: '40px',
            color: 'white',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        
        <input
          type="tel"
          placeholder="Mobile Number *"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 18px',
            margin: '10px 0',
            background: '#1A1A22',
            border: '1px solid #333',
            borderRadius: '40px',
            color: 'white',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        
        <input
          type="email"
          placeholder="Email ID *"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 18px',
            margin: '10px 0',
            background: '#1A1A22',
            border: '1px solid #333',
            borderRadius: '40px',
            color: 'white',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        
        <input
          type="text"
          placeholder="Country of Purchase *"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 18px',
            margin: '10px 0',
            background: '#1A1A22',
            border: '1px solid #333',
            borderRadius: '40px',
            color: 'white',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        
        <input
          type="date"
          placeholder="Purchase Date *"
          value={formData.purchaseDate}
          onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 18px',
            margin: '10px 0',
            background: '#1A1A22',
            border: '1px solid #333',
            borderRadius: '40px',
            color: 'white',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        
        <div className="modal-footer" style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '40px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none',
              background: '#E50914',
              color: 'white',
              fontFamily: "'Orbitron', monospace",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Submitting...' : <><i className="fas fa-check-circle"></i> Submit</>}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '40px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: 'none',
              background: '#2C2C36',
              color: '#ddd',
              fontFamily: "'Orbitron', monospace"
            }}
          >
            <i className="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
};