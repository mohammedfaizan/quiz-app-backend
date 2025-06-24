const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegisterUser = async (req, res) => {
  try {
    const { userName, name, email, password } = req.body;

    if (!userName || !name || !email || !password)
      return res.status(400).json({
        message: "Username, name, email and password is required to register",
      });

    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "user already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      email,
      name,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "user created successfully",
      success: true,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "bad request email & password required" });

    const userExists = await User.findOne({ email });
    if (!userExists) return res.status(400).json({ message: "user not found" });

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (!passwordMatch)
      return res
        .status(401)
        .json({ message: "Authentication failed! incorrect password" });

    const token = jwt.sign(
      { userId: userExists._id },
      process.env.MY_JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ message: "user logged in successfully", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Unexpected error login failed: ${error.message}` });
  }
};

const quizAttemps = async (req, res) => {
  try {
    const userId = req.user._id;
    const user_attempts = await User.findById(userId).populate("quiz_attempts");

    res.status(200).json({ attempts: attempts.quiz_attempts });
  } catch (error) {
    console.error("error fetching quiz attempts");
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleRegisterUser, handleUserLogin, quizAttemps };
