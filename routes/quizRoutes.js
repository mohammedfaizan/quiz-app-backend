const express = require("express");
const authenticateUser = require("../middleware/userMiddleware");
const { submitQuiz, completedQuiz } = require("../controller/submitController");

const quizRouter = express.Router();

quizRouter.post("/submit", authenticateUser, submitQuiz);
quizRouter.get("/completed-quiz-questions", authenticateUser, completedQuiz);

module.exports = quizRouter;
