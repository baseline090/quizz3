// quizController.js

const Quiz = require('../models/Quiz');
const Category= require('../models/Category');

//---------- Add a new quiz
exports.addQuiz = async (req, res) => {
  const { name, title, description, questions, passingCriteria, scorePerQuestion, totalPercentage, category, signature } = req.body;
  console.log("Incoming request body:", req.body);

  if (!name || !title || !description || !questions || !passingCriteria || !scorePerQuestion || !totalPercentage || !category || !signature) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const totalTime = questions.length * 2;
    const adjustedScorePerQuestion = Math.max(scorePerQuestion, 1);

    const foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      return res.status(400).json({ error: "Category not found" });
    }

    const quiz = new Quiz({
      name,
      title,
      description,
      questions,
      totalTime,
      passingCriteria,
      scorePerQuestion: adjustedScorePerQuestion,
      totalPercentage,
      isAvailable: true,
      category: foundCategory._id,
      signature,  // Save the signature
    });

    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error while saving quiz:", error);
    res.status(500).json({ error: "An error occurred while saving the quiz", details: error.message });
  }
};
  
// Get all quizzes
exports.getAllQuiz = async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    if (!quizzes.length) {
      return res.status(404).json({ error: 'No quizzes found' });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error while fetching quizzes:", error);
    res.status(500).json({ error: 'An error occurred while fetching quizzes' });
  }
};

// Delete a quiz by ID
exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ status: 'error', error: 'Quiz not found' });
    }

    res.status(200).json({ status: 'success', message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error("Error while deleting quiz:", error);
    res.status(500).json({ status: 'error', error: 'An error occurred while deleting the quiz' });
  }
};