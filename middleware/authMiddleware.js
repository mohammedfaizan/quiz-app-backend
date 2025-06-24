const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.MY_JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ message: "Authentication failed: User not found." });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
