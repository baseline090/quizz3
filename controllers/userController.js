const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const tokenBlacklist = require("../utils/tokenBlacklist");
const Category = require("../models/Category");
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'saurabhs26667@gmail.com',
    pass: 'eqvptugwdfwbinmv',
  },
});


// Register a new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("\nValidation failed:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, username, email, password } = req.body;

  // Validate required fields
  if (!fullName || !username || !email || !password) {
    console.log(
      "\nAll fields are required: fullName, username, email, password"
    );
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("\nEmail is already registered:", email);
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("\nUsername is already taken:", username);
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("\nUser registered successfully:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log("Login attempt:", req.body);

  // Check if email or password is missing
  if (!email || !password) {
    console.log("\nLogin failed: Missing credentials");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      console.log("\nLogin failed: User not found", { email });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Log the entered password and the stored hashed password for debugging
    console.log("Entered password:", password);
    console.log("Stored hashed password:", user.password);

    // Compare entered password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("\nLogin failed: Incorrect password", { email });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT payload and sign the token
    const payload = {
      userId: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("\nLogin successful", { token });
    return res.status(200).json({
      message: "Login successful!",
      token,
      data: {
        userId: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Logout API controller
exports.logout = (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("Token not provided");
    return res.status(400).json({ message: "Token not provided" });
  }
  // Add token to the blacklist
  tokenBlacklist.addToken(token);
  console.log("\nBlocklisted Tocken", token);
  console.log("\nUser successfuly logged out");
  res.status(200).json({ message: "User successfully logged out" });
};


// // Send OTP for password reset
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User with email ${email} not found. Please register first.`);
//       return res
//         .status(404)
//         .json({ message: "User not found. Please register first." });
//     }

//     // Generate a new 4-digit OTP
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     user.otp = otp; // Update user's OTP
//     await user.save();
//     console.log(`OTP sent to ${email}.`);
//     res.json({ status: "success", message: "OTP sent to your email." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Send OTP for password reset (only send via email, don't store in DB)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP in memory with expiration (5 minutes)
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Send OTP via email
    const mailOptions = {
      from: 'aakash.verma.nature@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ status: 'success', message: 'OTP sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};












// // Verify OTP

// exports.verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user || user.otp !== otp) {
//       console.log(`Invalid OTP for user with email: ${email}.`);
//       return res.status(400).json({ status: "error", message: "Invalid OTP." });
//     }
//     console.log(`OTP verified successfully for user with email: ${email}.`);
//     res.json({ status: "verified", message: "OTP verified successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    const storedOtpData = otpStore.get(email)
;
    
    if (!storedOtpData || storedOtpData.otp !== otp) {
      return res.status(400).json({ status: 'error', message: 'Invalid OTP.' });
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email)
;
      return res.status(400).json({ status: 'error', message: 'OTP has expired.' });
    }

    // OTP is valid; generate JWT reset token
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

    // Remove OTP after successful verification (Prevent reuse)
    otpStore.delete(email)
;

    res.json({ status: 'verified', message: 'OTP verified successfully.', resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};








// Reset password
// exports.resetPassword = async (req, res) => {
//   const { email, newPassword, confirmPassword } = req.body;

//   // Check if newPassword and confirmPassword match
//   if (newPassword !== confirmPassword) {
//     console.log(`Passwords do not match for user with email: ${email}.`);
//     return res.status(400).json({ message: "Passwords do not match." });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User with email ${email} not found. Please register first.`);
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Update password
//     user.password = newPassword; // Set new password
//     user.otp = null; // Clear OTP
//     await user.save();
//     console.log("Password updated successfully ");
//     res.json({ message: "Password updated successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



exports.resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Reset token missing.' });
  }

  const resetToken = authHeader.split(' ')[1];

  try {
    // Verify JWT token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    // Invalidate reset token by changing JWT secret (optional)
    process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');

    res.json({ message: 'Password updated successfully. Reset token is now invalid.' });
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token has expired.' });
    }
    res.status(400).json({ message: 'Invalid reset token.' });
  }
};

















// Profile Update Controller
exports.updateProfile = async (req, res) => {
  console.log("Received Profile Update Request");

  const { firstName, username, email, phoneNumber,profilePic } = req.body;
  console.log("Extracted User ID from Token:", req.user.userId);

  const userId = req.user.userId;

  try {
    // Check for file size error
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    console.log("Received Data:", req.body);

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found in database:", user);

    // Update profile details
    if (firstName) user.firstName = firstName;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profilePic) user.profilePic = profilePic;
 

    // Update profile picture if provided
    if (req.file) {
      console.log("Profile picture uploaded:", req.file.originalname);
      user.profilePic = req.file.buffer.toString("base64");
    } else {
      console.log("No profile picture uploaded.");
    }

    // Save the updated user
    await user.save();
    console.log("User profile updated successfully in database.");

    // Send response with updated user details
    res.json({
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic, // Base64 string format
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File size is too large. Maximum size is 2MB." });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to fetch user profile
exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  console.log('userId12: ', userId);
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.log(`User not found Please register first.`);
      return res.status(404).json({ message: "User not found" });
    }

    const base64ProfilePic = user.profilePic || null;

    res.json({
      message: "User profile fetched successfully",
      profile: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePic: base64ProfilePic,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error while fetching categories" });
  }
};
