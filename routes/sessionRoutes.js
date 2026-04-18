const express = require('express');
const router = express.Router();
const {
  createSession,
  getAllSessions,
  getSessionById,
  getLecturerSessions
} = require('../controllers/sessionController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Create a session - Lecturer only
// POST http://localhost:5000/api/sessions
router.post('/', protect, authorizeRoles('lecturer'), createSession);

// Get all sessions - Admin only
// GET http://localhost:5000/api/sessions
router.get('/', protect, authorizeRoles('admin'), getAllSessions);

// Get lecturer's own sessions - Lecturer only
// GET http://localhost:5000/api/sessions/my-sessions
router.get('/my-sessions', protect, authorizeRoles('lecturer'), getLecturerSessions);

// Get a single session - Admin and Lecturer
// GET http://localhost:5000/api/sessions/:id
router.get('/:id', protect, authorizeRoles('admin', 'lecturer'), getSessionById);

module.exports = router;