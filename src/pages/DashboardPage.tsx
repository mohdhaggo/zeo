import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface WarrantyRecord {
  id: string;
  warrantyNumber: string;
  productName: string;
  manufactureDate?: string;
  status: string;
  registrationDate?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  purchaseDate?: string;
  purchaseCountry?: string;
  createdAt?: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  region: string;
  interest: string;
  message: string;
  status: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warranty' | 'contact'>('warranty');
  const [warrantyRecords, setWarrantyRecords] = useState<WarrantyRecord[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingRecord, setEditingRecord] = useState<WarrantyRecord | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    warrantyNumber: '',
    productName: '',
    manufactureDate: '',
    status: 'UNREGISTERED',
    customerName: '',
    phone: '',
    email: '',
    purchaseDate: '',
    purchaseCountry: ''
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      window.location.href = '/admin-login';
      return;
    }
    fetchData();

    // Check screen size for initial sidebar state
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch warranties
      const warrantyResult = await client.models.Warranty.list();
      setWarrantyRecords((warrantyResult.data || []) as WarrantyRecord[]);

      // Fetch contact submissions
      const contactResult = await client.models.ContactSubmission.list();
      setContactSubmissions((contactResult.data || []) as ContactSubmission[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    window.location.href = '/admin-login';
  };

  const handleAddWarranty = () => {
    setEditingRecord(null);
    setFormData({
      warrantyNumber: '',
      productName: '',
      manufactureDate: '',
      status: 'UNREGISTERED',
      customerName: '',
      phone: '',
      email: '',
      purchaseDate: '',
      purchaseCountry: ''
    });
    setShowModal(true);
  };

  const handleEditWarranty = (record: WarrantyRecord) => {
    setEditingRecord(record);
    setFormData({
      warrantyNumber: record.warrantyNumber,
      productName: record.productName,
      manufactureDate: record.manufactureDate || '',
      status: record.status,
      customerName: record.customerName || '',
      phone: record.phone || '',
      email: record.email || '',
      purchaseDate: record.purchaseDate || '',
      purchaseCountry: record.purchaseCountry || ''
    });
    setShowModal(true);
  };

  const handleDeleteWarranty = async (id: string) => {
    if (window.confirm('Delete this warranty record permanently?')) {
      try {
        await client.models.Warranty.delete({ id });
        await fetchData();
        setSuccessMessage('Warranty deleted successfully!');
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Error deleting warranty:', error);
        setSuccessMessage('Failed to delete warranty record');
        setShowSuccessModal(true);
      }
    }
  };

  const handleSaveWarranty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const now = new Date().toISOString();
      
      if (editingRecord) {
        await client.models.Warranty.update({
          id: editingRecord.id,
          warrantyNumber: formData.warrantyNumber,
          productName: formData.productName,
          manufactureDate: formData.manufactureDate || null,
          status: formData.status,
          customerName: formData.customerName || null,
          phone: formData.phone || null,
          email: formData.email || null,
          purchaseDate: formData.purchaseDate || null,
          purchaseCountry: formData.purchaseCountry || null
        });
        setSuccessMessage('Warranty updated successfully!');
      } else {
        await client.models.Warranty.create({
          warrantyNumber: formData.warrantyNumber,
          productName: formData.productName,
          manufactureDate: formData.manufactureDate || null,
          status: formData.status,
          customerName: formData.customerName || null,
          phone: formData.phone || null,
          email: formData.email || null,
          purchaseDate: formData.purchaseDate || null,
          purchaseCountry: formData.purchaseCountry || null,
          createdAt: now
        });
        setSuccessMessage('Warranty added successfully!');
      }
      
      setShowModal(false);
      setShowSuccessModal(true);
      await fetchData();
    } catch (error) {
      console.error('Error saving warranty:', error);
      setSuccessMessage('Failed to save warranty record');
      setShowSuccessModal(true);
    }
  };

  const exportToCSV = () => {
    const filtered = warrantyRecords.filter(r =>
      r.warrantyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.customerName && r.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const csvRows = [
      ['Seq', 'Warranty_ID', 'Product_type', 'Manufacture Date', 'Status', 'Registration Date', 'Registered To', 'Mobile Number', 'Email ID', 'Purchase Date', 'Purchase Country']
    ];

    filtered.forEach((rec, idx) => {
      csvRows.push([
        (idx + 1).toString(),
        rec.warrantyNumber,
        rec.productName,
        rec.manufactureDate || '-',
        rec.status === 'ACTIVE' ? 'Registered' : 'Unregistered',
        rec.registrationDate ? new Date(rec.registrationDate).toLocaleDateString() : '-',
        rec.customerName || '-',
        rec.phone || '-',
        rec.email || '-',
        rec.purchaseDate || '-',
        rec.purchaseCountry || '-'
      ]);
    });

    const csvContent = csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "warranty_records.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    
    setSuccessMessage('CSV exported successfully!');
    setShowSuccessModal(true);
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      await client.models.ContactSubmission.update({ id, status });
      await fetchData();
      setSuccessMessage('Contact status updated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating contact status:', error);
      setSuccessMessage('Failed to update status');
      setShowSuccessModal(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const filteredWarranty = warrantyRecords.filter(r =>
    r.warrantyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.customerName && r.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '80px' : '280px',
        background: '#050508',
        borderRight: '1px solid rgba(229,9,20,0.3)',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        transition: 'width 0.3s ease',
        zIndex: 100
      }}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid #1a1a22', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between' }}>
          {!sidebarCollapsed && (
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
          )}
          {sidebarCollapsed && (
            <img src="/zeo_logo.webp" alt="Zeo" style={{ height: '42px' }} />
          )}
          <button
            onClick={toggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E50914',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '4px 8px'
            }}
          >
            <i className={`fas fa-chevron-${sidebarCollapsed ? 'right' : 'left'}`}></i>
          </button>
        </div>
        
        <ul style={{ listStyle: 'none', padding: '0 16px' }}>
          <li 
            onClick={() => setActiveTab('warranty')}
            style={{
              marginBottom: '8px',
              background: activeTab === 'warranty' ? 'rgba(229,9,20,0.15)' : 'transparent',
              borderLeft: activeTab === 'warranty' ? '3px solid #E50914' : 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              color: activeTab === 'warranty' ? '#E50914' : '#bbb',
              textDecoration: 'none',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
            }}>
              <i className="fas fa-shield-alt"></i>
              {!sidebarCollapsed && <span>Warranty</span>}
            </div>
          </li>
          <li 
            onClick={() => setActiveTab('contact')}
            style={{
              marginBottom: '8px',
              background: activeTab === 'contact' ? 'rgba(229,9,20,0.15)' : 'transparent',
              borderLeft: activeTab === 'contact' ? '3px solid #E50914' : 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              color: activeTab === 'contact' ? '#E50914' : '#bbb',
              textDecoration: 'none',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
            }}>
              <i className="fas fa-envelope"></i>
              {!sidebarCollapsed && <span>Contact Requests</span>}
            </div>
          </li>
        </ul>
      </div>
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarCollapsed ? '80px' : '280px', 
        padding: '24px 32px',
        transition: 'margin-left 0.3s ease',
        overflowX: 'auto',
        width: 'calc(100% - ' + (sidebarCollapsed ? '80px' : '280px') + ')'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.8rem' }}>
            {activeTab === 'warranty' ? 'Warranty Management' : 'Contact Requests'}
          </h1>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {activeTab === 'warranty' && (
              <>
                <button
                  onClick={handleAddWarranty}
                  style={{
                    background: '#E50914',
                    color: 'white',
                    padding: '10px 22px',
                    borderRadius: '40px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-plus"></i> Add New
                </button>
                <button
                  onClick={exportToCSV}
                  style={{
                    background: 'transparent',
                    border: '1px solid #E50914',
                    color: '#E50914',
                    padding: '10px 22px',
                    borderRadius: '40px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-download"></i> Export CSV
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: '#2C2C36',
                color: '#ddd',
                padding: '10px 22px',
                borderRadius: '40px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        {activeTab === 'warranty' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by Warranty ID, Name, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: '#1A1A22',
                  border: '1px solid #333',
                  padding: '10px 18px',
                  borderRadius: '40px',
                  color: 'white',
                  width: '260px'
                }}
              />
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  padding: '0 20px',
                  background: '#2C2C36',
                  color: '#ddd',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>

            <div style={{
              background: '#0C0C12',
              borderRadius: '24px',
              border: '1px solid rgba(229,9,20,0.2)',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Loading...</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1300px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Seq</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Warranty_ID</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Product_type</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Manufacture Date</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Registration Date</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Registered To</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Mobile Number</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Email ID</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Purchase Date</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Purchase Country</th>
                      <th style={{ textAlign: 'left', padding: '18px 16px', background: '#12121A', color: '#E50914' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWarranty.length === 0 ? (
                      <tr>
                        <td colSpan={12} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No warranty records found. Add your first warranty!</td>
                      </tr>
                    ) : (
                      filteredWarranty.map((rec, idx) => (
                        <tr key={rec.id}>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{idx + 1}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}><strong>{rec.warrantyNumber}</strong></td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{rec.productName}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{rec.manufactureDate || '-'}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '40px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              background: rec.status === 'ACTIVE' ? '#0e3a2e' : '#3a2a1e',
                              color: rec.status === 'ACTIVE' ? '#4caf50' : '#ff9800'
                            }}>{rec.status === 'ACTIVE' ? 'Registered' : 'Unregistered'}</span>
                          </td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{rec.registrationDate ? new Date(rec.registrationDate).toLocaleDateString() : '-'}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{rec.customerName || '-'}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{rec.phone || '-'}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{rec.email || '-'}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{rec.purchaseDate || '-'}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{rec.purchaseCountry || '-'}</td>
                          <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>
                            <i className="fas fa-edit" onClick={() => handleEditWarranty(rec)} style={{ color: '#4caf50', margin: '0 6px', cursor: 'pointer' }}></i>
                            <i className="fas fa-trash-alt" onClick={() => handleDeleteWarranty(rec.id)} style={{ color: '#E50914', margin: '0 6px', cursor: 'pointer' }}></i>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === 'contact' && (
          <div style={{
            background: '#0C0C12',
            borderRadius: '24px',
            border: '1px solid rgba(229,9,20,0.2)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
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
                  {contactSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No contact submissions yet.</td>
                    </tr>
                  ) : (
                    contactSubmissions.map((sub) => (
                      <tr key={sub.id}>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{sub.id.slice(-8)}</td>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{sub.name}</td>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{sub.email}</td>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{sub.phone || '-'}</td>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{sub.region}</td>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>{sub.interest}</td>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22', maxWidth: '250px', wordBreak: 'break-word' }}>
                          {sub.message.length > 50 ? sub.message.substring(0, 50) + '...' : sub.message}
                        </td>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a22' }}>
                          <select
                            value={sub.status}
                            onChange={(e) => updateContactStatus(sub.id, e.target.value)}
                            style={{
                              background: '#1A1A22',
                              border: '1px solid #E50914',
                              borderRadius: '20px',
                              padding: '4px 12px',
                              color: 'white'
                            }}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="READ">Read</option>
                            <option value="REPLIED">Replied</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Warranty */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#0F0F15',
            borderRadius: '28px',
            maxWidth: '800px',
            width: '90%',
            padding: '28px',
            border: '1px solid rgba(229,9,20,0.5)',
            margin: '20px'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Orbitron', monospace", color: '#E50914', marginBottom: '20px' }}>
              {editingRecord ? <><i className="fas fa-edit"></i> Edit Warranty</> : <><i className="fas fa-plus-circle"></i> Add Warranty Record</>}
            </h3>
            <form onSubmit={handleSaveWarranty}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Warranty_ID *</label>
                  <input
                    type="text"
                    value={formData.warrantyNumber}
                    onChange={(e) => setFormData({ ...formData, warrantyNumber: e.target.value })}
                    required
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Product_type *</label>
                  <select
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  >
                    <option value="">Select Product</option>
                    <option value="TITAN PPF">TITAN PPF</option>
                    <option value="ULTRA PPF">ULTRA PPF</option>
                    <option value="TITAN SATIN PPF">TITAN SATIN PPF</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Manufacture Date</label>
                  <input
                    type="date"
                    value={formData.manufactureDate}
                    onChange={(e) => setFormData({ ...formData, manufactureDate: e.target.value })}
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Registered To</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Mobile Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Email ID</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Purchase Country</label>
                  <input
                    type="text"
                    value={formData.purchaseCountry}
                    onChange={(e) => setFormData({ ...formData, purchaseCountry: e.target.value })}
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ background: '#1A1A22', border: '1px solid #333', padding: '12px', borderRadius: '28px', color: 'white' }}
                  >
                    <option value="UNREGISTERED">Unregistered</option>
                    <option value="ACTIVE">Registered</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: '#2C2C36', color: '#ddd', padding: '12px 24px', borderRadius: '40px', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ background: '#E50914', color: 'white', padding: '12px 24px', borderRadius: '40px', border: 'none', cursor: 'pointer' }}>
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal - Popup instead of alert */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowSuccessModal(false)}>
          <div style={{
            background: '#0F0F15',
            borderRadius: '36px',
            maxWidth: '450px',
            width: '90%',
            padding: '40px 35px',
            textAlign: 'center',
            border: '1px solid rgba(76, 175, 80, 0.5)',
            boxShadow: '0 30px 50px rgba(0,0,0,0.6)',
            animation: 'modalPopIn 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '5rem', color: '#4caf50', marginBottom: '20px' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 style={{ fontFamily: "'Orbitron', monospace", color: '#4caf50', fontSize: '1.8rem', marginBottom: '15px' }}>Success!</h3>
            <p style={{ color: '#ddd', margin: '10px 0', lineHeight: '1.5' }}>{successMessage}</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '40px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: "'Orbitron', monospace",
                marginTop: '20px',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#45a049'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#4caf50'}
            >
              <i className="fas fa-check"></i> Continue
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPopIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            z-index: 1000;
          }
          
          .main-content {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
};