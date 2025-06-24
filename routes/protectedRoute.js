const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, (req, res) => {
  res.status(200).json({ message: "protected route accessed" });
});

module.exports = router;
