const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const tokenBlacklist = require('../utils/tokenBlacklist');

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email, role: 'admin' });
    if (existingAdmin) {
      console.log('Admin with this email already exists', email);
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    console.log('Admin registered successfully:', newAdmin);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email, role: 'admin' });
    if (!admin) {
      console.log('No admin found with this email');
      return res.status(400).json({ message: 'No admin found with this email' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Invalid email or password');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT payload
    const payload = {
      adminId: admin._id,
      email: admin.email,
      role: admin.role,
    };

    // Sign the token with a 24-hour expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    console.log('Login successful', {
      token,
      data: {
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });

    return res.status(200).json({
      message: 'Login successful!',
      token,
      data: {
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users for Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('User ID is required');
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log('Deleted user:', deletedUser);
    if (!deletedUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// Admin Logout
exports.adminLogout = (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('Token not provided');
    return res.status(400).json({ message: 'Token not provided' });
  }

  tokenBlacklist.addToken(token);
  console.log('Blocklisted token:', token);
  console.log('Admin successfully logged out');
  res.status(200).json({ message: 'Admin successfully logged out' });
};
