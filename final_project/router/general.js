const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const bookList = Object.values(books); // Retrieve all books from the data

    return res.status(200).json({ books: JSON.stringify(bookList) });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const requestedISBN = req.params.isbn; // Retrieve the ISBN from request parameters

    // Find the book with the matching ISBN
    const book = books[requestedISBN];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Return the book details
    return res.status(200).json({ book });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
