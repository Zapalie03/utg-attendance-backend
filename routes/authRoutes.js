const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Register route
// POST http://localhost:5000/api/auth/register
router.post('/register', registerUser);

// Login route
// POST http://localhost:5000/api/auth/login
router.post('/login', loginUser);

module.exports = router;