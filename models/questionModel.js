// import mongoose from "mongoose";

const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      id: { type: Number, required: true },
      value: { type: String, required: true },
    },
  ],
  answer: {
    id: { type: Number, required: true },
    value: { type: String, required: true },
  },
});

const Question = mongoose.model("Question", questionSchema);
// export default Question;

module.exports = Question;
