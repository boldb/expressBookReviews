const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  //Write your code here
//    const { username, password } = req.body;

    // Check if both fields are provided
//    if (!username || !password) {
 //       return res.status(400).json({ message: "Username and password are required" });
 //   }

    // Check if the username already exists
  //  if (users[username]) {
  //      return res.status(409).json({ message: "Username already exists" });
   // }

    // Register the user
  //  users[username] = { password };
  //  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
//  const isbn = req.params.isbn;
//  if (books[isbn]) {
//    return res.status(200).json(books[isbn]);
//} else 
//{return res.status(300).json({message: "Yet to be implemented"});
//}
  
// });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author.toLowerCase();
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === authorName);
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
}
  else {
  return res.status(300).json({message: "Yet to be implemented"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
} else {
  return res.status(300).json({message: "Yet to be implemented"});
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
} else {
  return res.status(300).json({message: "Yet to be implemented"});
}
});

public_users.get('/', function (req, res) {
    axios.get('http://netwarebb-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/') // Replace with actual API URL
        .then(response => {
            res.status(200).json(response.data);
        })
            .catch(error => {
        res.status(500).json({ message: "Error fetching books", error: error.message });
        });
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get('http://netwarebb-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}') // Replace with actual API URL
        .then(response => {
            res.status(200).json(response.data);
        })
            .catch(error => {
        res.status(500).json({ message: "Error fetching books", error: error.message });
        });
});
module.exports.general = public_users;
