const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
     let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here  // Assuming the username is passed in the query or session
  const { review } = req.body;  // Assuming review is passed in the request body
  const { isbn } = req.params;  // ISBN is passed in the URL

  // Check if review data is provided in the body
    if (!req.session.authorization) {
        return res.status(401).json({ message: "You need to log in first" });
    }
    const username = req.session.authorization.username;
  // Check if the user is authenticated (for example, using session or token)
  // Check if the book exists in the database
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
        if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

  // Check if the review exists for the user
    books[isbn].reviews[username] = review;
  // Update the review for the specified ISBN

  // Respond with success message
  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
     const { isbn } = req.params;
    if (!req.session.authorization) {
        return res.status(401).json({ message: "You need to log in first" });
    }
    const username = req.session.authorization.username;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
