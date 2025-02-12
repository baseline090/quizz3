
// const jwt = require('jsonwebtoken');
// const tokenBlacklist = require('../utils/tokenBlacklist');

// const auth = (roles = []) => (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized access. Please login first.' });
//   }

//   if (tokenBlacklist.isTokenBlacklisted(token)) {
//     return res.status(401).json({ message: 'Token is invalid. Please login again.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user info to request

//     // Check if user role is authorized
//     if (roles.length && !roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
//     }

//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Unauthorized access. Please login again.' });
//   }
// };

// module.exports = auth;


const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  
    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token' });
  }
};

exports.authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access Denied. Unauthorized Role.' });
    }
    console.log(`Access granted to ${req.user.role} for ${req.originalUrl}`);
    next();
  };
};


