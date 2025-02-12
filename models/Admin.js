// ////////--------------latest 19-12-2024------------------//////

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Role can be 'admin' or 'user'
    required: true,
    default: 'admin',
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
