const express = require("express");
const cors = require("cors");
const path = require("path"); // Added missing path import
const db = require("./utils/db");
const questionRouter = require("./routes/questionRoutes");
const authRouter = require("./routes/authRoutes");
const protectedRoute = require("./routes/protectedRoute");
const quizRouter = require("./routes/quizRoutes");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database connection
db();

// Routes
app.use("/api/v2/user", authRouter);
app.use("/protected", protectedRoute);
app.use("/api/v2/questions", questionRouter);
app.use("/api/v2/quiz", quizRouter);

// Error Handling Middleware
// 404 error
app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

// General Error handler
app.use((error, req, res, next) => {
  res.locals.message = error.message;
  res.locals.error = process.env.NODE_ENV === "development" ? error : {};
  res.status(error.status || 500);
  res.render("error"); // Render error template
});

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`); // Fixed typo in log message
});
