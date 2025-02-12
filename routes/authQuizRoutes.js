// const express = require("express");
// const { body } = require("express-validator");
// const router = express.Router();
// const categoryController = require("../controllers/cateogryController");
// // ----- Controllers
// const adminController = require("../controllers/adminController");
// const quizController1 = require("../controllers/quiz1Controller");

// //------ Middleware for authentication
// const auth = require("../middleware/auth");



// //------------Admin Routes---------------------------------//

// // Admin Registration Route
// router.post(
//   "/admin/register",
//   [
//     body("email").isEmail().withMessage("Email is invalid"),
//     body("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 characters"),
//     body("confirmPassword")
//       .exists()
//       .withMessage("Please confirm your password"),
//   ],
//   adminController.registerAdmin
// );

// // Admin Login Route
// router.post(
//   "/admin/login",
//   [
//     body("email").isEmail().withMessage("Email is invalid"),
//     body("password").notEmpty().withMessage("Password is required"),
//   ],
//   adminController.loginAdmin
// );


// // Admin added Category routes
// router.post("/admin/category/add",auth(["admin"]),categoryController.addCategory);




// router.post("/admin/quizzes", auth(["admin"]), quizController1.addQuiz);
// router.get("/admin/quizzes", auth(["admin"]), quizController1.getAllQuiz);
// router.delete(
//   "/admin/quizzes/:id",
//   auth(["admin"]),
//   quizController1.deleteQuiz
// );

// module.exports = router;
