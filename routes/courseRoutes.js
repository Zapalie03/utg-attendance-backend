const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollStudent
} = require('../controllers/courseController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Create a course - Admin only
// POST http://localhost:5000/api/courses
router.post('/', protect, authorizeRoles('admin'), createCourse);

// Get all courses - Admin, Lecturer, Student
// GET http://localhost:5000/api/courses
router.get('/', protect, getAllCourses);

// Get a single course - Admin, Lecturer, Student
// GET http://localhost:5000/api/courses/:id
router.get('/:id', protect, getCourseById);

// Enroll a student - Admin only
// PUT http://localhost:5000/api/courses/:id/enroll
router.put('/:id/enroll', protect, authorizeRoles('admin'), enrollStudent);

module.exports = router;