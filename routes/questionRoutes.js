// import express from "express";
// import { addAnswer, getQuestions } from "../controller/question.controller.js";

// const questionRouter = express.Router();
// questionRouter.get("/", getQuestions);
// questionRouter.post("/validate-answer", addAnswer);

// export default questionRouter;

const express = require("express");
const {
  getQuestions,
  validateAnswer,
} = require("../controller/question.controller.js");
const authenticateUser = require("../middleware/userMiddleware.js");

const questionRouter = express.Router();

questionRouter.get("/", authenticateUser, getQuestions);
questionRouter.post("/validate-answer", authenticateUser, validateAnswer);

module.exports = questionRouter;
