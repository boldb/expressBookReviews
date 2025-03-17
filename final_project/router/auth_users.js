const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users={};
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Example: username must be alphanumeric and between 3 to 15 characters
    return usernameRegex.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if (users[username]) {
        // Check if the provided password matches the stored password
        return users[username].password === password;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password required." });
  }

  if (!isValid(username)) {
      return res.status(404).json({ message: "User not found." });
  }

  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid credentials." });
  }

  // ✅ Generate JWT token
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username } = req.query;  // Assuming the username is passed in the query or session
  const { review } = req.body;  // Assuming review is passed in the request body

  const { isbn } = req.params;  // ISBN is passed in the URL

  // Check if review data is provided in the body
  if (!review) {
      return res.status(400).json({ message: "Review data is required" });
  }

  // Check if the user is authenticated (for example, using session or token)
  if (!username) {
      return res.status(401).json({ message: "You need to log in first" });
  }

  // Check if the book exists in the database
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists for the user
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
  }

  // Update the review for the specified ISBN
  books[isbn].reviews[username] = review;

  // Respond with success message
  return res.status(200).json({ message: "Review updated successfully" });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
