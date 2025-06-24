const { default: mongoose } = require("mongoose");

const QUIZ_STATUS_PENDING = "pending";

const QUIZ_STATUS_COMPLETED = "completed";

const ANSWER_STATUS_PENDING = "pending";
const ANSWER_STATUS_RIGHT = "right";
const ANSWER_STATUS_WRONG = "wrong";

const userQuizSchema = mongoose.Schema(
  {
    user_id: String,
    quiz_status: {
      type: String,
      enum: [QUIZ_STATUS_COMPLETED, QUIZ_STATUS_PENDING],
    },
    questions: [
      {
        _id: false,
        question_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        attempted: Boolean,
        answer_status: {
          type: String,
          enum: [
            ANSWER_STATUS_PENDING,
            ANSWER_STATUS_RIGHT,
            ANSWER_STATUS_WRONG,
          ],
        },

        submitted_answer: {
          _id: false,
          id: Number,
          value: String,
        },
      },
    ],

    result: {
      correct_count: {
        type: Number,
        default: 0,
      },
      incorrect_count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timeStamps: true }
);

//instance methods
userQuizSchema.methods.updateResult = function () {
  let result = this.questions.reduce(
    function (acc, currentValue) {
      if (currentValue.answer_status === ANSWER_STATUS_RIGHT) {
        acc["correct_count"] += 1;
      } else if (currentValue.answer_status === ANSWER_STATUS_WRONG) {
        acc["incorrect_count"] += 1;
      }
      return acc;
    },
    {
      correct_count: 0,
      incorrect_count: 0,
    }
  );

  this.result = result;
  this.save();
};

const userQuiz = mongoose.model("UserQuiz", userQuizSchema);

module.exports = {
  userQuiz,
  QUIZ_STATUS_COMPLETED,
  QUIZ_STATUS_PENDING,
  ANSWER_STATUS_PENDING,
  ANSWER_STATUS_RIGHT,
  ANSWER_STATUS_WRONG,
};
