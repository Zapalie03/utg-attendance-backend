const Course = require('../models/Course');

// CREATE A COURSE (Admin only)
const createCourse = async (req, res) => {
  try {
    const { courseName, courseCode, department, lecturer } = req.body;

    // Check if course code already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    // Create new course
    const newCourse = new Course({
      courseName,
      courseCode,
      department,
      lecturer
    });

    // Save to database
    await newCourse.save();

    res.status(201).json({ 
      message: 'Course created successfully', 
      course: newCourse 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL COURSES
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('lecturer', 'fullName email')
      .populate('students', 'fullName email matriculationNumber');

    res.status(200).json(courses);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET A SINGLE COURSE
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lecturer', 'fullName email')
      .populate('students', 'fullName email matriculationNumber');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ENROLL A STUDENT INTO A COURSE (Admin only)
const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student is already enrolled
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    // Add student to course
    course.students.push(studentId);
    await course.save();

    res.status(200).json({ message: 'Student enrolled successfully', course });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCourse, getAllCourses, getCourseById, enrollStudent };