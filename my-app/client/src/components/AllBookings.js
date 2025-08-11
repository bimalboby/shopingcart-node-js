import React, { useState, useEffect } from 'react';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load booking data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  if (loading) {
    return (
      <div className=\"container\">
        <div className=\"page-header\">
          <h2>All Bookings</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p>Loading booking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=\"container\">
        <div className=\"page-header\">
          <h2>All Bookings</h2>
        </div>
        <div className=\"alert alert-danger\">
          <strong>Error:</strong> {error}
          <br />
          <button 
            className=\"btn btn-primary\" 
            onClick={handleRefresh}
            style={{ marginTop: '10px' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=\"container\">
      <div className=\"page-header\">
        <h2>All Bookings</h2>
        <button 
          className=\"btn btn-default\" 
          onClick={handleRefresh}
          style={{ float: 'right', marginTop: '-40px' }}
        >
          Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p>No booking records found.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginTop: '20px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #dee2e6'
              }}>
                <th style={{ 
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#495057',
                  borderRight: '1px solid #dee2e6'
                }}>
                  Tour ID
                </th>
                <th style={{ 
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#495057',
                  borderRight: '1px solid #dee2e6'
                }}>
                  Tour Name
                </th>
                <th style={{ 
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#495057',
                  borderRight: '1px solid #dee2e6'
                }}>
                  Place
                </th>
                <th style={{ 
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#495057',
                  borderRight: '1px solid #dee2e6'
                }}>
                  Email
                </th>
                <th style={{ 
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  First Name
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr 
                  key={`${booking.TOUR_ID}-${booking.Email}-${index}`}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                    borderBottom: '1px solid #dee2e6',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.parentElement.style.backgroundColor = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.target.parentElement.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                  }}
                >
                  <td style={{ 
                    padding: '12px 15px',
                    borderRight: '1px solid #dee2e6',
                    color: '#495057'
                  }}>
                    {booking.TOUR_ID || 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '12px 15px',
                    borderRight: '1px solid #dee2e6',
                    color: '#495057',
                    fontWeight: '500'
                  }}>
                    {booking.TOUR_NAME || 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '12px 15px',
                    borderRight: '1px solid #dee2e6',
                    color: '#495057'
                  }}>
                    {booking.PLACE || 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '12px 15px',
                    borderRight: '1px solid #dee2e6',
                    color: '#495057'
                  }}>
                    {booking.Email || 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '12px 15px',
                    color: '#495057'
                  }}>
                    {booking.FirstName || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        color: '#6c757d',
        fontSize: '14px'
      }}>
        Total Bookings: {bookings.length}
      </div>

      {/* Mobile responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }
          
          table {
            font-size: 14px;
          }
          
          th, td {
            padding: 8px 10px !important;
          }
          
          .page-header h2 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          
          .btn {
            font-size: 14px;
            padding: 8px 16px;
          }
        }
        
        @media (max-width: 576px) {
          table {
            font-size: 12px;
          }
          
          th, td {
            padding: 6px 8px !important;
          }
          
          .page-header h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AllBookings;