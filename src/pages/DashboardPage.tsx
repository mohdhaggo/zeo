import React, { useEffect, useState } from 'react';
import { contactService } from '../services/contactService';
import { ContactSubmission } from '../types/contact';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warranty' | 'contact'>('warranty');
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      window.location.href = '/admin-login';
      return;
    }
    
    fetchContactSubmissions();
  }, []);

  const fetchContactSubmissions = async () => {
    try {
      setLoading(true);
      const submissions = await contactService.getContactSubmissions();
      setContactSubmissions(submissions);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    window.location.href = '/admin-login';
  };

  const updateSubmissionStatus = async (id: string, status: 'pending' | 'read' | 'replied') => {
    try {
      await contactService.updateSubmissionStatus(id, status);
      await fetchContactSubmissions(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - same as HTML version */}
      <div style={{
        width: '280px',
        background: '#050508',
        borderRight: '1px solid rgba(229,9,20,0.3)',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid #1a1a22' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/zeo_logo.webp" alt="Zeo" style={{ height: '42px' }} />
            <span style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: '1.3rem',
              background: 'linear-gradient(130deg, #fff, #E50914)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>ZEO ADMIN</span>
          </div>
        </div>
        
        <ul style={{ listStyle: 'none', padding: '0 16px' }}>
          <li 
            onClick={() => setActiveTab('warranty')}
            style={{
              marginBottom: '8px',
              background: activeTab === 'warranty' ? 'rgba(229,9,20,0.15)' : 'transparent',
              borderLeft: activeTab === 'warranty' ? '3px solid #E50914' : 'none'
            }}
          >
            <a href="#" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              color: activeTab === 'warranty' ? '#E50914' : '#bbb',
              textDecoration: 'none'
            }}>
              <i className="fas fa-shield-alt"></i> Warranty
            </a>
          </li>
          <li 
            onClick={() => setActiveTab('contact')}
            style={{
              marginBottom: '8px',
              background: activeTab === 'contact' ? 'rgba(229,9,20,0.15)' : 'transparent',
              borderLeft: activeTab === 'contact' ? '3px solid #E50914' : 'none'
            }}
          >
            <a href="#" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              color: activeTab === 'contact' ? '#E50914' : '#bbb',
              textDecoration: 'none'
            }}>
              <i className="fas fa-envelope"></i> Contact Requests
            </a>
          </li>
        </ul>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: '280px', padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.8rem' }}>
            {activeTab === 'warranty' ? 'Warranty Management' : 'Contact Requests'}
          </h1>
          <button 
            onClick={handleLogout}
            style={{
              background: '#E50914',
              color: 'white',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '40px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
        
        {activeTab === 'contact' && (
          <div style={{ background: '#0C0C12', borderRadius: '24px', overflow: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Loading...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Region</th>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Interest</th>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Message</th>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contactSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{submission.id.slice(-8)}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{submission.name}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{submission.email}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{submission.phone || '-'}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{submission.region}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{submission.interest}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22', maxWidth: '250px' }}>
                        {submission.message.length > 50 ? submission.message.substring(0, 50) + '...' : submission.message}
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>
                        <select
                          value={submission.status}
                          onChange={(e) => updateSubmissionStatus(submission.id, e.target.value as any)}
                          style={{
                            background: '#1A1A22',
                            border: '1px solid #E50914',
                            borderRadius: '20px',
                            padding: '4px 12px',
                            color: 'white'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'warranty' && (
          <div>
            {/* Warranty table content from the HTML will go here */}
            <p style={{ color: '#aaa', textAlign: 'center', padding: '50px' }}>
              Warranty management interface will be implemented similarly
            </p>
          </div>
        )}
      </div>
    </div>
  );
};