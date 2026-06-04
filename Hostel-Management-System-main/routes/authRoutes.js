const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, getCurrentUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Protected routes
router.get('/me', auth, getCurrentUser);

module.exports = router; 