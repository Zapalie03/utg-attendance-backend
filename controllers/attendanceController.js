const Attendance = require('../models/Attendance');
const Session = require('../models/Session');

// MARK ATTENDANCE (Student only)
const markAttendance = async (req, res) => {
  try {
    const { sessionId, courseId } = req.body;

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if QR code has expired
    if (new Date() > new Date(session.qrCodeExpiresAt)) {
      return res.status(400).json({ message: 'QR code has expired. Attendance not recorded.' });
    }

    // Check if session is still active
    if (!session.isActive) {
      return res.status(400).json({ message: 'This session is no longer active.' });
    }

    // Check if student already marked attendance
    const existingAttendance = await Attendance.findOne({
      session: sessionId,
      student: req.user.id
    });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this session.' });
    }

    // Create attendance record
    const attendance = new Attendance({
      session: sessionId,
      course: courseId,
      student: req.user.id,
      status: 'present'
    });

    // Save to database
    await attendance.save();

    res.status(201).json({ message: 'Attendance marked successfully!', attendance });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ATTENDANCE BY SESSION (Lecturer and Admin)
const getAttendanceBySession = async (req, res) => {
  try {
    const attendance = await Attendance.find({ session: req.params.sessionId })
      .populate('student', 'fullName email matriculationNumber')
      .populate('course', 'courseName courseCode');

    res.status(200).json({
      totalPresent: attendance.length,
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ATTENDANCE BY COURSE (Lecturer and Admin)
const getAttendanceByCourse = async (req, res) => {
  try {
    const attendance = await Attendance.find({ course: req.params.courseId })
      .populate('student', 'fullName email matriculationNumber')
      .populate('session', 'date startTime endTime');

    res.status(200).json({
      totalRecords: attendance.length,
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET MY ATTENDANCE (Student only)
const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user.id })
      .populate('course', 'courseName courseCode')
      .populate('session', 'date startTime endTime');

    res.status(200).json({
      totalClasses: attendance.length,
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { markAttendance, getAttendanceBySession, getAttendanceByCourse, getMyAttendance };