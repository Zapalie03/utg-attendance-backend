const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceBySession,
  getAttendanceByCourse,
  getMyAttendance
} = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Mark attendance - Student only
// POST http://localhost:5000/api/attendance
router.post('/', protect, authorizeRoles('student'), markAttendance);

// Get attendance by session - Lecturer and Admin
// GET http://localhost:5000/api/attendance/session/:sessionId
router.get('/session/:sessionId', protect, authorizeRoles('lecturer', 'admin'), getAttendanceBySession);

// Get attendance by course - Lecturer and Admin
// GET http://localhost:5000/api/attendance/course/:courseId
router.get('/course/:courseId', protect, authorizeRoles('lecturer', 'admin'), getAttendanceByCourse);

// Get my attendance - Student only
// GET http://localhost:5000/api/attendance/my-attendance
router.get('/my-attendance', protect, authorizeRoles('student'), getMyAttendance);

module.exports = router;