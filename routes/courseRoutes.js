const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollStudent
} = require('../controllers/courseController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Course = require('../models/Course');

// Create a course - Admin only
router.post('/', protect, authorizeRoles('admin'), createCourse);

// Get all courses
router.get('/', protect, getAllCourses);

// Get a single course
router.get('/:id', protect, getCourseById);

// Enroll a student - Admin only
router.put('/:id/enroll', protect, authorizeRoles('admin'), enrollStudent);

// Update a course - Admin only
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { courseName, courseCode, department } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, courseCode, department },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a course - Admin only
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;