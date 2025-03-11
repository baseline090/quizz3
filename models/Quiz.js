const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description:{type: String, required: true},
  questions: { type: [questionSchema], required: true },
  totalTime:{ type: Number, required: true },
  passingCriteria: { type: Number, required: true },
  scorePerQuestion: { type: Number, required: true },
  totalPercentage: { type: Number, required: true },
  isAvailable: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  signature:{type: String,required: true }
});

module.exports = mongoose.model('Quiz', quizSchema);






