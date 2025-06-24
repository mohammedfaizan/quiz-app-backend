const Question = require("../models/questionModel.js");
const {
  userQuiz: UserQuizModel,
  QUIZ_STATUS_PENDING,
  ANSWER_STATUS_PENDING,
  ANSWER_STATUS_RIGHT,
  ANSWER_STATUS_WRONG,
} = require("../models/userQuizModel.js");

const MAX_QUESTION_COUNT = 30;

const getQuestions = async (req, res) => {
  try {
    // Get the incomplete quiz of the user
    // If a user logs out in the middle of the quiz,
    // they should be able to resume or continue their quiz
    let userQuiz = await UserQuizModel.findOne({
      user_id: req.user._id,
      quiz_status: QUIZ_STATUS_PENDING,
    }).populate("questions.question_id", "question options");

    if (!userQuiz) {
      const randomQuestions = await Question.aggregate([
        { $sample: { size: MAX_QUESTION_COUNT } },
        { $project: { question: 1, options: 1 } },
      ]);

      const quizQuestions = randomQuestions.map((question) => ({
        question_id: question._id,
        attempted: false,
        answer_status: ANSWER_STATUS_PENDING,
        submitted_answer: null,
      }));

      userQuiz = await new UserQuizModel({
        user_id: req.user._id,
        quiz_status: QUIZ_STATUS_PENDING,
        questions: quizQuestions,
      }).save();

      userQuiz = await userQuiz.populate(
        "questions.question_id",
        "question options"
      );
    }

    const questions = userQuiz.questions
      .map((q) => {
        if (!q.question_id) {
          return null;
        }

        return {
          _id: q.question_id._id,
          question: q.question_id.question,
          options: q.question_id.options,
          attempted: q.attempted,
          answer_status: q.answer_status,
          submitted_answer: q.submitted_answer,
        };
      })
      .filter((q) => q !== null);

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    // You should handle errors properly
    console.error("Error fetching user quiz:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const validateAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    if (!questionId || !answer || !answer.id) {
      return res.status(400).json({
        message: "Invalid request question id , answer and answer id required",
      });
    }

    let question = await Question.findById(questionId);

    if (!question) {
      return res.status(400).json({ message: "question does not exist" });
    }

    let answerStatus = false;
    if (
      question.answer.id === answer.id &&
      question.answer.value === answer.value
    ) {
      answerStatus = true;
    }

    const updatedUserQuiz = await UserQuizModel.findOneAndUpdate(
      {
        "questions.question_id": questionId,
        user_id: req.user._id,
        quiz_status: QUIZ_STATUS_PENDING,
      },
      {
        $set: {
          "questions.$.attempted": true,
          "questions.$.answer_status": answerStatus
            ? ANSWER_STATUS_RIGHT
            : ANSWER_STATUS_WRONG,
          "questions.$.submitted_answer": answer,
        },
      },
      { new: true }
    );

    await updatedUserQuiz?.updateResult();

    return res.status(200).json({
      status: answerStatus ? 1 : 0,
      message: answerStatus ? "Correct answer :)" : "Wrong Answer :(",
      submitted_answer: answer,
      correct_answer: question.answer,
    });
  } catch (error) {
    console.error("Error creating a task: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getQuestions, validateAnswer };
