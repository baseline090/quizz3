// const mongoose = require('mongoose');






// const resultSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to the User model
//     required: true,
//   },
//   quizId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Quiz', // Reference to the Quiz model
//     required: true,
//   },
//   correctAnswer:{
//     type: Number,
//     required: true,
//   },
//   totalScore: {
//     type: Number,
//     required: true,
//   },
//   incorrectAnswer:{
//     type: Number,
//     required: true,
//   },
//   totalQuestions: {
//     type: Number,
//     required: true,
//   },
//   totalPercentage: {
//     type: Number,
//     required: true,
//   },
//   passFail: {
//     type: String,
//     enum: ['pass', 'fail'],
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now, 
//   },
 
// });

// module.exports = mongoose.model('Result', resultSchema);



const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  correctAnswer: {
    type: Number,
    default: 0,
    required: true,
  },
  incorrectAnswer: {
    type: Number,
    default: 0,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  totalPercentage: {
    type: Number,
    required: true,
  },
  passFail: {
    type: String,
    enum: ["pass", "fail"],
    required: true,
  },
  questionDetails: [
    {
      questionText: {
        type: String,
        required: true,
      },
      options: {
        type: [String], // Ensuring it's an array of strings
        required: true,
      },
      correctAnswer: {
        type: String,
        required: true,
      },
      userAnswer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
      scorePoint: {
        type: Number,
        default: 0,
        required: true, // Ensuring consistency
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Result", resultSchema);
