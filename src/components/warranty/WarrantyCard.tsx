import React, { useState } from 'react';
import { warrantyService } from '../../services/warrantyService';
import { WarrantyRecord } from '../../types/warranty';
import { RegistrationModal } from './RegistrationModal';

export const WarrantyCard: React.FC = () => {
  const [warrantyId, setWarrantyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [validWarranty, setValidWarranty] = useState<WarrantyRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  const validateWarranty = async () => {
    if (!warrantyId.trim()) {
      setMessage({ text: '⚠️ Please enter a Warranty ID.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await warrantyService.validateWarranty(warrantyId);
      
      if (!result.isValid) {
        setMessage({ text: result.message, type: 'error' });
        setValidWarranty(null);
        setIsEligible(false);
      } else if (result.record && result.record.status === 'ACTIVE' && result.record.customerName) {
        // Already registered
        setMessage({ 
          text: `✅ Valid Warranty! This warranty is already registered to ${result.record.customerName}. Registration date: ${result.record.registrationDate}`,
          type: 'success'
        });
        setValidWarranty(result.record);
        setIsEligible(false);
      } else if (result.record && result.isEligibleForRegistration) {
        // Eligible for registration
        setMessage({ 
          text: `✅ Valid Warranty! This product (${result.record.productType}) is eligible for registration. Click "Register Now" to complete.`,
          type: 'success'
        });
        setValidWarranty(result.record);
        setIsEligible(true);
      }
    } catch (error) {
      setMessage({ text: '❌ Error validating warranty. Please try again later.', type: 'error' });
      setValidWarranty(null);
      setIsEligible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    setShowModal(true);
  };

  const handleReset = () => {
    setWarrantyId('');
    setMessage(null);
    setValidWarranty(null);
    setIsEligible(false);
  };

  const handleRegistrationSuccess = () => {
    setShowModal(false);
    setMessage({ 
      text: '✅ Warranty successfully registered! A confirmation email has been sent.',
      type: 'success'
    });
    setIsEligible(false);
    setWarrantyId('');
  };

  return (
    <>
      <div className="warranty-card fade-section" style={{
        maxWidth: '560px',
        margin: '20px auto 60px',
        background: '#0C0C12',
        borderRadius: '32px',
        border: '1px solid rgba(229,9,20,0.3)',
        padding: '40px 36px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        transition: 'transform 0.3s ease'
      }}>
        <div className="warranty-icon" style={{ fontSize: '4rem', color: '#E50914', marginBottom: '16px' }}>
          <i className="fas fa-id-card"></i>
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', color: '#fff' }}>Check Your Warranty</h2>
        <p style={{ color: '#aaa', marginBottom: '28px', fontSize: '0.95rem' }}>
          Please enter the Warranty ID provided with your product purchase.
        </p>
        
        <div className="input-group" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            type="text"
            value={warrantyId}
            onChange={(e) => setWarrantyId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && validateWarranty()}
            placeholder="Enter Warranty ID (e.g., ZEO-ULTRA-1001)"
            style={{
              flex: '2',
              minWidth: '200px',
              padding: '14px 20px',
              background: '#1A1A22',
              border: '1px solid #333',
              borderRadius: '60px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
            disabled={loading}
          />
          <button
            onClick={validateWarranty}
            disabled={loading}
            style={{
              padding: '14px 32px',
              background: '#E50914',
              border: 'none',
              borderRadius: '60px',
              fontWeight: 'bold',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Orbitron', monospace",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Checking...' : <><i className="fas fa-arrow-right"></i> Enter</>}
          </button>
        </div>
        
        {message && (
          <div className="message-area" style={{
            background: message.type === 'error' ? '#1e1215' : message.type === 'success' ? '#121b12' : '#1f1b10',
            borderRadius: '24px',
            padding: '16px 20px',
            margin: '20px 0',
            textAlign: 'center',
            fontSize: '0.95rem',
            borderLeft: `4px solid ${message.type === 'error' ? '#E50914' : message.type === 'success' ? '#4caf50' : '#ffc107'}`,
            color: message.type === 'error' ? '#ff9b9b' : message.type === 'success' ? '#b9f6ca' : '#ffe0a3'
          }}>
            <div dangerouslySetInnerHTML={{ __html: message.text }} />
          </div>
        )}
        
        {(isEligible || message) && (
          <div className="action-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' }}>
            {isEligible && (
              <button
                onClick={handleRegister}
                style={{
                  padding: '12px 28px',
                  borderRadius: '40px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: '#E50914',
                  color: 'white',
                  border: 'none',
                  fontFamily: "'Orbitron', monospace"
                }}
              >
                <i className="fas fa-pen-alt"></i> Register Now
              </button>
            )}
            <button
              onClick={handleReset}
              style={{
                padding: '12px 28px',
                borderRadius: '40px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: '#2C2C36',
                color: '#ddd',
                border: 'none',
                fontFamily: "'Orbitron', monospace"
              }}
            >
              <i className="fas fa-times"></i> Clear
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        .warranty-card:hover {
          transform: translateY(-5px);
          border-color: rgba(229,9,20,0.6);
        }
        .input-group input:focus {
          border-color: #E50914;
          outline: none;
        }
      `}</style>
      
      <RegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        warrantyId={warrantyId}
        validWarranty={validWarranty}
        onSuccess={handleRegistrationSuccess}
      />
    </>
  );
};