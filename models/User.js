const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'lecturer', 'admin'],
    default: 'student'
  },
  matriculationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);