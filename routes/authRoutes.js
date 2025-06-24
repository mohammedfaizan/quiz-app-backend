const {
  handleRegisterUser,
  handleUserLogin,
  quizAttemps,
} = require("../controller/auth.controller");
const express = require("express");
const authenticateUser = require("../middleware/userMiddleware");

const authRouter = express.Router();

authRouter.post("/auth/register", handleRegisterUser);
authRouter.post("/auth/login", handleUserLogin);
authRouter.get("/auth/quiz-attempts", authenticateUser, quizAttemps);

module.exports = authRouter;
