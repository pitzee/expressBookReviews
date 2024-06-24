const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user (you can hash the password and store it securely)
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully" });


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
    const requestedAuthor = req.params.author; // Retrieve the author name from request parameters

    // Filter books by author
    const authorBooks = Object.values(books).filter(book => book.author === requestedAuthor);

    if (authorBooks.length === 0) {
        return res.status(404).json({ message: 'No books found for this author' });
    }

    // Return the book details
    return res.status(200).json({ books: authorBooks });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title; // Retrieve the title from request parameters

    // Filter books by title
    const titleBooks = Object.values(books).filter(book => book.title === requestedTitle);

    if (titleBooks.length === 0) {
        return res.status(404).json({ message: 'No books found with this title' });
    }

    // Return the book details
    return res.status(200).json({ books: titleBooks });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const requestedISBN = req.params.isbn; // Retrieve the ISBN from request parameters

    // Find the book with the matching ISBN
    const book = books[requestedISBN];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Retrieve book reviews (assuming reviews are stored in the 'reviews' property)
    const reviews = book.reviews || {};

    return res.status(200).json({ reviews });
});

module.exports.general = public_users;
