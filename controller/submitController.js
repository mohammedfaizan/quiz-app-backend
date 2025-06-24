const Question = require("../models/questionModel");
const {
  QUIZ_STATUS_PENDING,
  UserQuiz: UserQuizModel,
  QUIZ_STATUS_COMPLETED,
  userQuiz,
} = require("../models/userQuizModel");

const submitQuiz = async (req, res) => {
  try {
    let userCurrentQuiz = await UserQuizModel.findOne({
      user_id: req.user._id,
      quiz_status: QUIZ_STATUS_PENDING,
    });

    if (!userCurrentQuiz) {
      return res
        .status(500)
        .json({ success: false, message: "No active quiz for the user" });
    }

    userCurrentQuiz.quiz_status = QUIZ_STATUS_COMPLETED;

    const user = await User.findOne({ _id: req.user._id });
    user.quiz_attempts = user.quiz_attempts + 1;
    user.save();
    userCurrentQuiz.save();

    let incorrect_questions = [];
    let correct_questions = [];

    for (const userQuestion of userCurrentQuiz.questions) {
      const questionModel = await Question.findById(userQuestion.question_id);

      let _data = {
        question_id: userQuestion.question_id,
        question: questionModel.question,
        attempted: userQuestion.attempted,
        answer_status: userQuestion.answer_status,
        submitted_answer: userQuestion.submitted_answer,
      };

      if (
        questionModel.answer.id === userQuestion.submitted_answer.id &&
        questionModel.answer.value === userQuestion.submitted_answer.value
      ) {
        correct_questions.push(_data);
      } else {
        incorrect_questions.push(_data);
      }
    }

    return res.send({
      status: true,
      result: userCurrentQuiz.result,
      incorrect_questions,
      correct_questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const completedQuiz = async (req, res) => {
  try {
    let userCompletedQuiz = await userQuiz
      .findOne({
        user_id: req.user._id,
        quiz_status: QUIZ_STATUS_COMPLETED,
      })
      .sort({ createdAt: -1 });

    if (!userCompletedQuiz) {
      return res
        .status(400)
        .json({ success: false, message: "user has not completed any quiz" });
    }

    const correct_questions = [];
    const incorrect_questions = [];

    for (const userQuestion of userCompletedQuiz.questions) {
      const questionModel = await Question.findOne(userQuestion.question_id);

      const _data = {
        question_id: userQuestion.question_id,
        question: questionModel.question,
        submitted_answer: userQuestion.submitted_answer,
        attempted: userQuestion.attempted,
        answer_status: userQuestion.answer_status,
        correct_answer: questionModel.answer,
      };

      if (
        questionModel.answer.id === userQuestion.submitted_answer.id &&
        questionModel.submitted_answer.value === userQuestion.answer.value
      ) {
        correct_questions.push(_data);
      } else {
        incorrect_questions.push(_data);
      }

      return res.status(200).json({
        success: true,
        result: userCompletedQuiz.result,
        quiz_attempts: userCompletedQuiz.quiz_attempts,
        correct_questions,
        incorrect_questions,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching completed quiz",
    });
  }
};

module.exports = { submitQuiz, completedQuiz };
