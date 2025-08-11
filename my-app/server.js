const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'your_database',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true // Use this if you're using self-signed certificates
  }
};

// Initialize database connection
let pool;

async function initializeDatabase() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to SQL Server database');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// JWT Secret (in production, use a secure secret from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Query database for user
    const request = pool.request();
    request.input('email', sql.VarChar, email);
    
    const result = await request.query(`
      SELECT id, email, password, name 
      FROM Userinfo 
      WHERE email = @email
    `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = result.recordset[0];

    // For the original code compatibility, we'll check plain text password
    // In production, you should use hashed passwords
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Password is not correct' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Password is correct',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Protected route example (for profile page)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const request = pool.request();
    request.input('userId', sql.Int, req.user.userId);
    
    const result = await request.query(`
      SELECT id, email, name, created_at 
      FROM Userinfo 
      WHERE id = @userId
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: result.recordset[0]
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Bookings endpoint - Get all booking records
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const request = pool.request();
    
    // Query to get all booking records with tour and customer information
    // Matches the original ASP.NET GridView columns: TOUR_ID, TOUR_NAME, PLACE, Email, FirstName
    const result = await request.query(`
      SELECT 
        TOUR_ID,
        TOUR_NAME,
        PLACE,
        Email,
        FirstName
      FROM [booking]
      ORDER BY TOUR_ID, Email
    `);

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      bookings: result.recordset,
      count: result.recordset.length
    });

  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve booking data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Registration endpoint (for sign up functionality)
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    const checkRequest = pool.request();
    checkRequest.input('email', sql.VarChar, email);
    
    const existingUser = await checkRequest.query(`
      SELECT id FROM Userinfo WHERE email = @email
    `);

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Insert new user (storing plain text password for compatibility)
    // In production, hash the password: const hashedPassword = await bcrypt.hash(password, 10);
    const insertRequest = pool.request();
    insertRequest.input('email', sql.VarChar, email);
    insertRequest.input('password', sql.VarChar, password);
    insertRequest.input('name', sql.VarChar, name);
    
    const result = await insertRequest.query(`
      INSERT INTO Userinfo (email, password, name, created_at) 
      OUTPUT INSERTED.id
      VALUES (@email, @password, @name, GETDATE())
    `);

    const userId = result.recordset[0].id;

    // Create JWT token
    const token = jwt.sign(
      { userId, email, name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: userId, email, name }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Logout endpoint
app.post('/api/logout', authenticateToken, (req, res) => {
  // In a stateless JWT system, logout is handled client-side by removing the token
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});

module.exports = app;