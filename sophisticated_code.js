/* sophisticated_code.js */

// This code represents a complex and elaborate social media platform
// with user authentication, profile customization, and posts functionality

// Imports
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create express app
const app = express();
app.use(bodyParser.json());

// Database simulation
const users = [];
const posts = [];

// Routes

// User registration
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).send("Error hashing password");
    }

    // Save user to the database
    users.push({ username, password: hashedPassword });

    return res.status(201).send("User registered successfully");
  });
});

// User login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find user in the database
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).send("User not found");
  }

  // Compare provided password with the saved hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(500).send("Error comparing passwords");
    }

    if (!result) {
      return res.status(401).send("Invalid password");
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, "secret_key");

    return res.status(200).send({ token });
  });
});

// Profile customization
app.put("/profile", authenticateToken, (req, res) => {
  const { username } = req.user;
  const { firstName, lastName } = req.body;

  // Update user profile in the database
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).send("User not found");
  }

  user.firstName = firstName;
  user.lastName = lastName;

  return res.send("User profile updated successfully");
});

// Post creation
app.post("/posts", authenticateToken, (req, res) => {
  const { username } = req.user;
  const { content } = req.body;

  // Save post to the database
  const post = { username, content };
  posts.push(post);

  return res.status(201).send("Post created successfully");
});

// Post retrieval
app.get("/posts", authenticateToken, (req, res) => {
  const { username } = req.user;

  // Retrieve posts by user
  const userPosts = posts.filter((post) => post.username === username);

  return res.send(userPosts);
});

// Middleware for authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access token not found");
  }

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    req.user = user;
    next();
  });
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
