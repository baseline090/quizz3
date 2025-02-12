// const express = require("express");
// const { body } = require("express-validator");
// const userController = require("../controllers/userController");
// const userQuesController = require("../controllers/userQuesController");
// const adminController = require("../controllers/adminController");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const multer = require("multer");
// const categoryController = require("../controllers/cateogryController");
// const resultController = require("../controllers/resultController");

// // Set up multer to handle image upload
// const storage = multer.memoryStorage();
// // const upload = multer({ storage: storage });
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2 MB
//     fileFilter: (req, file, cb) => {
//         // Check file type (optional, for example to allow only images)
//         if (!file.mimetype.startsWith('image/')) {
//             return cb(new Error('Only image files are allowed!'), false);
//         }
//         cb(null, true);
//     },
// });

// // const upload = multer(); // Memory storage for base64 conversion
// router.put('/user/profile/update', auth.authenticateJWT, auth.authorizeRole('user'), upload.single('profilePic'), userController.updateProfile);

// // ------ Users  Route ------
// router.post(
//   "/register",
//   [
//     body("fullName").notEmpty().withMessage("Full name is required"),
//     body("username").notEmpty().withMessage("Username is required"),
//     body("email").isEmail().withMessage("Email is invalid"),
//     body("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 characters"),
//   ],
//   userController.register
// );

// // User Login Route
// router.post(
//   "/login",
//   [
//     body("email").isEmail().withMessage("Email is invalid"),
//     body("password").notEmpty().withMessage("Password is required"),
//   ],
//   userController.login
// );

// // Route for sending OTP
// router.post("/forgotpassword", userController.forgotPassword);

// // Route for verifying OTP
// router.post("/verifyotp", userController.verifyOtp);

// // Route for resetting password
// router.post("/resetpassword", userController.resetPassword);

// // User Profile Update Route (protected)
// router.put(
//   "/user/profile/update",
//   auth(["user"]),
//   userController.updateProfile
// );

// //------ Create quiz route
// router.get("/user/quizdata", auth(["user"]), userQuesController.getAllUserQuiz);

// //------ Create quiz route
// router.get(
//   "/user/quizzesID/:id",
//   auth(["user"]),
//   userQuesController.getQuizById
// );

// // User Profile Route (protected)
// router.get("/user/profile", auth(["user"]), userController.getUserProfile);

// // User Category routes
// router.get("/user/allcategories", auth(["user"]), categoryController.getAllCategories);
// router.delete('/user/delete/categories',auth(["user"]), categoryController.deleteCategory);
// router.get('/user/categories/:categoryId', auth(["user"]), categoryController.getCategoryById);
// router.get('/user/category/:categoryName', auth(["user"]) ,categoryController.getQuizzesByCategoryName);

// // Fetch  quiz submissions
// router.post("/submit/quiz", auth(["user"]), resultController.submitQuiz);
// router.get('/all-submissions', auth(["user"]), resultController.getAllsubmitQuiz);
// router.get('/result/:resultId', resultController.getResultById);

// router.post("/logout", userController.logout);
// router.post("/admin/logout", adminController.adminLogout);

// module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const userQuesController = require("../controllers/userQuesController");
const adminController = require("../controllers/adminController");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const categoryController = require("../controllers/cateogryController");
const resultController = require("../controllers/resultController");
const quizController1 = require("../controllers/quiz1Controller");

// Set up multer to handle image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2 MB
  fileFilter: (req, file, cb) => {
    // Check file type (optional, for example to allow only images)
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// User Routes

// User Registration Route
router.post(
  "/register",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  userController.register
);

// User Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  userController.login
);

// Route for sending OTP
router.post("/forgotpassword", userController.forgotPassword);

// Route for verifying OTP
router.post("/verifyotp", userController.verifyOtp);

// Route for resetting password
router.post("/resetpassword", userController.resetPassword);

// User Profile Update Route (protected)
router.put(
  "/user/profile/update",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  upload.single("profilePic"),
  userController.updateProfile
);

// User Profile Route (protected)
router.get(
  "/user/profile",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  userController.getUserProfile
);

// User Category Routes
router.get(
  "/user/allcategories",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  categoryController.getAllCategories
);
router.delete(
  "/user/delete/categories",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  categoryController.deleteCategory
);
router.get(
  "/user/categories/:categoryId",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  categoryController.getCategoryById
);
router.get(
  "/user/category/:categoryName",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  categoryController.getQuizzesByCategoryName
);

// Fetch user quizzes and related data
router.get(
  "/user/quizdata",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  userQuesController.getAllUserQuiz
);
router.get(
  "/user/quizzesID/:id",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  userQuesController.getQuizById
);

// Quiz Submission Routes
router.post(
  "/submit/quiz",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  resultController.submitQuiz
);
router.get(
  "/all-submissions",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  resultController.getAllsubmitQuiz
);
router.get(
  "/result/:resultId",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  resultController.getResultById
);

// User Logout Route (protected)
router.post(
  "/logout",
  auth.authenticateJWT,
  auth.authorizeRole("user"),
  userController.logout
);

// Admin Logout Route (protected)
router.post(
  "/admin/logout",
  auth.authenticateJWT,
  auth.authorizeRole("admin"),
  adminController.adminLogout
);

/////-----admin------------////
// Admin Registration Route
router.post(
  "/admin/register",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("confirmPassword")
      .exists()
      .withMessage("Please confirm your password"),
  ],
  adminController.registerAdmin
);

// Admin Login Route
router.post(
  "/admin/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  adminController.loginAdmin
);

// Admin Add Category Route (protected)
router.post(
  "/admin/category/add",
  auth.authenticateJWT,
  auth.authorizeRole("admin"),
  categoryController.addCategory
);

// Admin Quiz Routes (protected)
router.post(
  "/admin/quizzes",
  auth.authenticateJWT,
  auth.authorizeRole("admin"),
  quizController1.addQuiz
);

router.get(
  "/admin/quizzes",
  auth.authenticateJWT,
  auth.authorizeRole("admin"),
  quizController1.getAllQuiz
);

router.delete(
  "/admin/quizzes/:id",
  auth.authenticateJWT,
  auth.authorizeRole("admin"),
  quizController1.deleteQuiz
);

module.exports = router;

// const express = require('express');
// const { body } = require('express-validator');
// const userController = require('../controllers/userController');
// const adminController = require('../controllers/adminController');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const Category = require('../models/Category'); // Import the Category model
// const categoryController = require('../controllers/cateogryController');
// const quiz1Controller = require('../controllers/quiz1Controller');

// const multer = require('multer');

// // const Category = require('../models/Category'); // Import the Category model

// // Set up multer to handle image upload
// const storage = multer.memoryStorage();
// // const upload = multer({ storage: storage });
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2 MB
//     fileFilter: (req, file, cb) => {
//         // Check file type (optional, for example to allow only images)
//         if (!file.mimetype.startsWith('image/')) {
//             return cb(new Error('Only image files are allowed!'), false);
//         }
//         cb(null, true);
//     },
// });

// // const upload = multer(); // Memory storage for base64 conversion
// router.put('/user/profile/update', auth.authenticateJWT, auth.authorizeRole('user'), upload.single('profilePic'), userController.updateProfile);

// //--------------------------User Routes----------------------------------//////

// // User Registration Route
// router.post('/register', [
//   body('fullName').notEmpty().withMessage('Full name is required'),
//   body('username').notEmpty().withMessage('Username is required'),
//   body('email').isEmail().withMessage('Email is invalid'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// ], userController.register);

// // User Login Route
// router.post('/login', [
//   body('email').isEmail().withMessage('Email is invalid'),
//   body('password').notEmpty().withMessage('Password is required')
// ], userController.login);

// // Route for sending OTP
// router.post('/forgotpassword', userController.forgotPassword);

// // Route for verifying OTP
// router.post('/verifyotp', userController.verifyOtp);

// // Route for resetting password
// router.post('/resetpassword', userController.resetPassword);

// // // User Profile Update Route (protected)
// router.put('/user/profile/update', auth.authenticateJWT, auth.authorizeRole('user'), userController.updateProfile);

// // User Categories Route (protected)
// router.get('/user/categories', auth.authenticateJWT, auth.authorizeRole('user'), categoryController.getAllCategories);

// // User Profile Route (protected)
// router.get('/user/profile', auth.authenticateJWT, auth.authorizeRole('user'), userController.getUserProfile);

// // Route to get available quizzes (User access)

// // User Logout Route (protected)
// router.post('/logout', auth.authenticateJWT, auth.authorizeRole('user'), userController.logout);

// // // User submit quiz and save it to the db (protected)
// // router.post('/user/submit/quiz', auth.authenticateJWT, auth.authorizeRole('user'), quiz1Controller.submitQuiz);

// //------------Admin Routes---------------------------------//

// // Admin Registration Route
// router.post('/admin/register', [
//   body('email').isEmail().withMessage('Email is invalid'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('confirmPassword').exists().withMessage('Please confirm your password')
// ], adminController.registerAdmin);

// // Admin Login Route
// router.post('/admin/login', [
//   body('email').isEmail().withMessage('Email is invalid'),
//   body('password').notEmpty().withMessage('Password is required')
// ], adminController.loginAdmin);

// // Admin Routes for getting all Users (protected)
// router.get('/admin/users', auth.authenticateJWT, auth.authorizeRole('admin'), adminController.getAllUsers);

// // Admin Route for Deleting a User (protected)
// router.delete('/admin/user/delete', auth.authenticateJWT, auth.authorizeRole('admin'), adminController.deleteUser);

// // Admin Routes for Category Management (protected)
// router.get('/admin/category', auth.authenticateJWT, auth.authorizeRole('admin'), categoryController.getAllCategories);

// // Admin Route for Adding a Category (protected)
// router.post('/admin/category/add', auth.authenticateJWT, auth.authorizeRole('admin'), categoryController.addCategory);

// // Admin Route for Deleting a Category (protected)
// router.delete('/admin/category/delete', auth.authenticateJWT, auth.authorizeRole('admin'), categoryController.deleteCategory);

// // Admin Logout Route (protected)
// router.post('/admin/logout', auth.authenticateJWT, auth.authorizeRole('admin'), adminController.adminLogout);

// module.exports = router;
