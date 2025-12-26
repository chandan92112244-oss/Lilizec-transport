import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  // ============================================
  // 📌 ALL STATES
  // ============================================
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [adminTab, setAdminTab] = useState('bookings');
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickup_address: '',
    drop_address: '',
    vehicle_type: 'e-rickshaw',
    payment_method: 'cash'
  });
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ============================================
  // 🔐 SECURE ADMIN AUTHENTICATION
  // ============================================
  
  const handleAdminAccess = async () => {
    const password = prompt("🔐 Enter Admin Password:");
    
    if (!password) {
      alert("❌ Password cannot be empty!");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/admin/verify`, { password });
      
      if (response.data.success) {
        const token = response.data.token;
        setIsAdmin(true);
        setAdminToken(token);
        localStorage.setItem('adminToken', token);
        setCurrentPage("admin");
        setAdminTab("bookings");
        alert("✅ Admin login successful!");
      } else {
        alert("❌ Wrong password!");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("❌ Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    setCurrentPage("home");
    alert("✅ Logged out successfully!");
  };

  // 🔒 HARD ADMIN GUARD
  useEffect(() => {
    if (currentPage === "admin" && !isAdmin) {
      setCurrentPage("home");
      alert("⚠️ Unauthorized Access! Admin login required.");
    }
  }, [currentPage, isAdmin]);

  // 🔒 Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.post(`${API}/admin/validate`, { token })
        .then(res => {
          if (res.data.valid) {
            setIsAdmin(true);
            setAdminToken(token);
          } else {
            localStorage.removeItem('adminToken');
          }
        })
        .catch(() => {
          localStorage.removeItem('adminToken');
        });
    }
  }, []);

  // ============================================
  // 📊 FETCH ADMIN DATA (Protected)
  // ============================================

  const fetchBookings = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("⚠️ Session expired. Please login again.");
      handleAdminLogout();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("⚠️ Session expired!");
        handleAdminLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("⚠️ Session expired. Please login again.");
      handleAdminLogout();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API}/drivers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(response.data);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("⚠️ Session expired!");
        handleAdminLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHelpRequests = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("⚠️ Session expired. Please login again.");
      handleAdminLogout();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API}/help`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHelpRequests(response.data);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("⚠️ Session expired!");
        handleAdminLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && currentPage === "admin") {
      if (adminTab === "bookings") fetchBookings();
      else if (adminTab === "drivers") fetchDrivers();
      else if (adminTab === "help") fetchHelpRequests();
    }
  }, [adminTab, isAdmin, currentPage]);

  // ============================================
  // 📝 PUBLIC FORM HANDLERS
  // ============================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post(`${API}/bookings`, formData);
      setSuccess('✅ Booking successful!');
      setFormData({ '',
        email: '',
        pickup_address: '',
        drop_address: '',
        vehicle_type: 'e-rickshaw',
        payment_method: 'cash'
      });
    } catch (error) {
      setError('❌ Booking failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post(`${API}/help`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message
      });
      setSuccess('✅ Message sent successfully!');
      setFormData({ ...formData, name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setError('❌ Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🎨 RENDER UI
  // ============================================

  return (
    <div className="App">
      {/* ========== HEADER ========== */}
      <header className="header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '28px' }}>🚗 Lilizec Transport</h1>
          <nav style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setCurrentPage('home')} style={buttonStyle}>Home</button>
            <button onClick={() => setCurrentPage('booking')} style={buttonStyle}>Book Now</button>
            <button onClick={() => setCurrentPage('contact')} style={buttonStyle}>Contact</button>
            
            {!isAdmin ? (
              <button onClick={handleAdminAccess} disabled={loading} style={{...buttonStyle, background: '#ff6b6b'}}>
                {loading ? "⏳" : "🔐 Admin"}
              </button>
            ) : (
              <>
                <button onClick={() => setCurrentPage('admin')} style={{...buttonStyle, background: '#51cf66'}}>📊 Panel</button>
                <button onClick={handleAdminLogout} style={{...buttonStyle, background: '#ff6b6b'}}>🚪 Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>

      ff6b6b'}}>🚪 Logout</button>
              </>
            )}
          </nav>
        </div{/* ========== MAIN CONTENT ========== */}
      <main style={{ minHeight: '80vh', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Welcome to Lilizec Transport 🚗</h2>
            <p style={{ fontSize: '18px', color: '#666' }}>Your trusted transport service provider in your city</p>
            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={cardStyle}>
                <h3>🚙 E-Rickshaw</h3>
                <p>Eco-friendly rides for short distances</p>
              </div>
              <div style={cardStyle}>
                <h3>🚚 Pickup Service</h3>
                <p>Transport goods safely and quickly</p>
              </div>
              <div style={cardStyle}>
                <h3>💰 Affordable Rates</h3>
                <p>Best prices in the market</p>
              </div>
            </div>
          </div>
        )}

        {/* BOOKING PAGE */}
        {currentPage === 'booking' && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📋 Book Your Ride</h2>
            <form onSubmit={handleBookingSubmit} style={formStyle}>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required style={inputStyle} />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required style={inputStyle} />
              <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleInputChange} style={inputStyle} />
              <textarea name="pickup_address" placeholder="Pickup Address" value={formData.pickup_address} onChange={handleInputChange} required style={{...inputStyle, minHeight: '80px'}} />
              <textarea name="drop_address" placeholder="Drop Address" value={formData.drop_address} onChange={handleInputChange} required style={{...inputStyle, minHeight: '80px'}} />
              
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Vehicle Type:</label>
                <select name="vehicle_type" value={formData.vehicle_type} onChange={handleInputChange} style={inputStyle}>
                  <option value="e-rickshaw">E-Rickshaw</option>
                  <option value="pickup">Pickup Truck</option>
                </select>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Payment Method:</label>
                <select name="payment_method" value={formData.payment_method} onChange={handleInputChange} style={inputStyle}>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              
              <button type="submit" disabled={loading} style={{...buttonStyle, width: '100%', marginTop: '20px', padding: '15px', fontSize: '16px', background: '#51cf66'}}>
                {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
              </button>
              
              {success && <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>{success}</p>}
              {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
            </form>
          </div>
        )}

        {/* CONTACT PAGE */}
        {currentPage === 'contact' && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📞 Contact Us</h2>
            <form onSubmit={handleContactSubmit} style={formStyle}>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required style={inputStyle} />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} required style={inputStyle} />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required style={inputStyle} />
              <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleInputChange} style={inputStyle} />
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleInputChange} required style={{...inputStyle, minHeight: '120px'}} />
              
              <button type="submit" disabled={loading} style={{...buttonStyle, width: '100%', marginTop: '20px', padding: '15px', fontSize: '16px', background: '#4c6ef5'}}>
                {loading ? '⏳ Sending...' : '📧 Send Message'}
              </button>
              
              {success && <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>{success}</p>}
              {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
            </form>
          </div>
        )}

        {/* 🔒 ADMIN PANEL - PROTECTED */}
        {currentPage === 'admin' && isAdmin && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🔐 Admin Panel</h2>
            
            {/* Admin Tabs */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
              <button onClick={() => setAdminTab('bookings')} style={{...buttonStyle, background: adminTab === 'bookings' ? '#4c6ef5' : '#868e96'}}>
                📋 Bookings
              </button>
              <button onClick={() => setAdminTab('drivers')} style={{...buttonStyle, background: adminTab === 'drivers' ? '#4c6ef5' : '#868e96'}}>
                👨‍✈️ Drivers
              </button>
              <button onClick={() => setAdminTab('help')} style={{...buttonStyle, background: adminTab === 'help' ? '#4c6ef5' : '#868e96'}}>
                💬 Help Requests</div>

            {/* Admin Content */}
            {loading ? (
              <p style={{ textAlign: 'center', fontSize: '20px' }}>⏳ Loading...</p>
            ) : (
              <>
                {adminTab === 'bookings' && (
                  <div>
                    <h3>
                {adminTab === 'bookings' && (
                  <div>
                    <h3>All Bookings ({bookings.length})</h3>
                    {bookings.length === 0 ? (
                      <p>No bookings found.</p>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={thStyle}>ID</th>
                              <th style={thStyle}>Name</th>
                              <th style={thStyle}>Phone</th>
                              <th style={thStyle}>Pickup</th>
                              <th style={thStyle}>Drop</th>
                              <th style={thStyle}>Vehicle</th>
                              <th style={thStyle}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking, index) => (
                              <tr key={booking.id || index}>
                                <td style={tdStyle}>{booking.id}</td>
                                <td style={tdStyle}>{booking.name || booking.customer_name}</td>
                                <td style={tdStyle}>{booking.phone}</td>
                                <td style={tdStyle}>{booking.pickup_address}</td>
                                <td style={tdStyle}>{booking.drop_address}</td>
                                <td style={tdStyle}>{booking.vehicle_type}</td>
                                <td style={tdStyle}>{booking.status || 'Pending'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {adminTab === 'drivers' && (
                  <div>
                    <h3>All Drivers ({drivers.length})</h3>
                    {drivers.length === 0 ? (
                      <p>No drivers found.</p>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={thStyle}>ID</th>
                              <th style={thStyle}>Name</th>
                              <th style={thStyle}>Phone</th>
                              <th style={thStyle}>Vehicle Type</th>
                              <th style={thStyle}>Status</thStyle}>Vehicle Type</th>
                              <th style={thStyle}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {drivers.map((driver, index) => (
                              <tr key={driver.id || index}>
                                <td style={tdStyle}>{driver.id}</td>
                                <td style={tdStyle}>{driver.name}</td>
                                <td style={tdStyle}>{driver.phone}</td>
                                <td style={tdStyle}>{driver.vehicle_type}</td>
                                <td style={tdStyle}>{driver.is_available ? '✅ Available' : '❌ Busy'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {adminTab === 'help' && (
                  <div>
                    <h3>Help Requests ({helpRequests.length})</h3>
                    {helpRequests.length === 0 ? (
                      <p>No help requests found.</p>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={thStyle}>ID</th>
                              <th style={thStyle}>Name</th>
                              <th style={thStyle}>Email</th>
                              <th style={thStyle}>Phone</th>
                              <th style={thStyle}>Subject</th>
                              <th style={thStyle}>Message</th>
                            </tr>
                          </thead>
                          <tbody>
                            {helpRequests.map((request, index) => (
                              <tr key={request.id || index}>
                                <td style={tdStyle}>{request.id}</td>
                                <td style={tdStyle}>{request.name}</td>
                                <td style={tdStyle}>{request.email}</td>
                                <td style={tdStyle}>{request.phone}</td>
                                <td style={tdStyle}>{request.subject}</td>
                                <td style={tdStyle}>{request.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* ========== FOOTER ========== */}
      <footer style={{
        background: '#2c3e50',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px'
      }}>
        <p style={{ margin: 0 }}>© 2025 Lilizec Transport. All rights reserved. 🚗</p>
      </footer>
    </div>
  );
}

// ============================================
// 🎨 STYLES
// ============================================

const buttonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  background: '#667'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'all 0.3s'
};

const cardStyle = {
  background: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const formStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  background: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  overflow: 'hidden'
};

const thStyle = {
  background: '#667eea',
  color: 'white',
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee'
};

export default App;
