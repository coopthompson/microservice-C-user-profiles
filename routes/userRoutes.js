const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require("axios"); // For cross-service communication
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const SYNOPSIS_SERVICE_URL = "http://localhost:5002/api/synopsisRoutes"; // Update if needed

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();
    res.json({ success: true, message: "User registered!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token, userId: username, username });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch user's saved synopses by calling the synopsis microservice
router.get("/synopsis/:userId", async (req, res) => {
  try {
    const response = await axios.get(`${SYNOPSIS_SERVICE_URL}/${req.params.userId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user synopses" });
  }
});

// Delete a synopsis via synopsis microservice
router.delete("/synopsis/delete/:id", async (req, res) => {
  try {
    const response = await axios.delete(`${SYNOPSIS_SERVICE_URL}/delete/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error deleting synopsis" });
  }
});

module.exports = router;
