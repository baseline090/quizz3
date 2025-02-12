const mongoose = require('mongoose');
const Quiz = require('../models/Quiz'); 

exports.getAllUserQuiz = async (req, res) => {
  try {
    const userQuiz = await Quiz.find();
    console.log('userQuiz: ', userQuiz);

    if (!userQuiz.length) { 
      return res.status(404).json({ message: 'No quizzes found.' });
    }

    res.status(200).json({ userQuiz });
  } catch (error) {
    console.error('Error while fetching userQuiz:', error);
    res.status(500).json({ message: 'An error occurred while fetching userQuiz.' });
  }
};

exports.getQuizById = async (req, res) => {
  const { id: quizId } = req.params; 

  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ message: 'Invalid quiz ID format.' });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    console.log('quiz: ', quiz);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error while fetching quiz:', error);
    res.status(500).json({ message: 'Server error while fetching quiz' });
  }
};

