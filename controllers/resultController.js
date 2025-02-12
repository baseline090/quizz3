const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    console.log("quizId: ", quizId);
    console.log("req.body: ", req.body);

    const quiz = await Quiz.findById(quizId);
    console.log("Fetched Quiz:", quiz);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    let correctAnswers = 0;
    let incorrectAnswers = 0;

    // Create an array to store detailed question results
    const questionDetails = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;

      if (userAnswer === "none") {
        incorrectAnswers++;
      } else if (isCorrect) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }

      return {
        questionText: question.text, 
        options: question.options, 
        correctAnswer: question.correctAnswer,
        userAnswer,
        isCorrect,
        scorePoint: isCorrect ? 1 : 0, 
      };
    });

    const totalPercentage = (correctAnswers / quiz.questions.length) * 100;
    const passFail = totalPercentage >= quiz.passingCriteria ? "pass" : "fail";

    
    const result = {
      userId: req.user.userId,
      quizId: quiz._id,
      totalScore: correctAnswers,
      totalQuestions: quiz.questions.length,
      totalPercentage,
      passFail,
      correctAnswer: correctAnswers, 
      incorrectAnswer: incorrectAnswers,
      questionDetails, 
    };

  
    const savedResult = await Result.create(result);

    return res.status(200).json({
      message: "Quiz submitted successfully",
      result: savedResult,
    });
  } catch (error) {
    console.error("Error in submitQuiz:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while submitting the quiz" });
  }
};



exports.getAllsubmitQuiz = async (req, res) => {
  try {
    const results = await Result.find().populate(
      "userId quizId",
      "fullName username email title description"
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "No quiz submissions found" });
    }

    return res.status(200).json({
      message: "Quiz submissions fetched successfully",
      results,
    });
  } catch (error) {
    console.error("Error in getAllsubmitQuiz:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching quiz submissions" });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;
    console.log("resultId: ", resultId);

    // Validate if the resultId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({ error: "Invalid resultId format" });
    }

    console.log("Fetching result with resultId:", resultId);

    const result = await Result.findById(resultId).populate(
      "userId quizId",
      "fullName username email title description"
    );

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    // Return the result
    return res.status(200).json({
      message: "Result fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getResultById:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the result" });
  }
};
