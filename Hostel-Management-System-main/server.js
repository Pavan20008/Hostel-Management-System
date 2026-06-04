const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const feeRoutes = require('./routes/feeRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Simple CORS configuration for development
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Hostel Management System',
        status: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Health check endpoint
app.get('/api/check-server', (req, res) => {
    res.json({ 
        status: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('\n====================================');
            console.log('🚀 Server Status:');
            console.log('------------------------------------');
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`✅ MongoDB is connected`);
            console.log('\n📍 Access Points:');
            console.log(`   → Main API: http://localhost:${PORT}`);
            console.log(`   → Health Check: http://localhost:${PORT}/api/check-server`);
            console.log(`   → Auth API: http://localhost:${PORT}/api/auth`);
            console.log(`   → Students API: http://localhost:${PORT}/api/students`);
            console.log(`   → Rooms API: http://localhost:${PORT}/api/rooms`);
            console.log(`   → Fees API: http://localhost:${PORT}/api/fees`);
            console.log(`   → Maintenance API: http://localhost:${PORT}/api/maintenance`);
            console.log('====================================\n');
        });
    })
    .catch(err => {
        console.error('\n❌ Failed to start server:', err);
        process.exit(1);
    }); 