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

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});


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


