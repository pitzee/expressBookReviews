const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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

    return res.status(200).json({ books:bookList });
});


const BOOKS_API_URL = books;

// Get the book list available in the shop (async/await with Axios)
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(BOOKS_API_URL);
        const bookList = response.data.books; // Adjust the property name as needed

        // Return the book list
        return res.status(200).json({ books: bookList });
    } catch (error) {
        console.error('Error fetching book list:', error.message);
        return res.status(500).json({ message: 'Error fetching book list' });
    }
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
  

// Get book details based on ISBN (async/await with Axios)
public_users.get('/isbn/:isbn', async (req, res) => {
    const requestedISBN = req.params.isbn;

    try {
        const response = await axios.get(`${BOOKS_API_URL}/${requestedISBN}`);
        const book = response.data; // Adjust the property names as needed

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({ book });
    } catch (error) {
        console.error('Error fetching book details:', error.message);
        return res.status(500).json({ message: 'Error fetching book details' });
    }
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


// Get book details based on author (async/await with Axios)
public_users.get('/author/:author', async (req, res) => {
    const requestedAuthor = req.params.author;

    try {
        const response = await axios.get(`${BOOKS_API_URL}/${requestedAuthor}`);
        const authorBooks = response.data; // Adjust the property names as needed

        if (!authorBooks || authorBooks.length === 0) {
            return res.status(404).json({ message: 'No books found for this author' });
        }

        return res.status(200).json({ books: authorBooks });
    } catch (error) {
        console.error('Error fetching author books:', error.message);
        return res.status(500).json({ message: 'Error fetching author books' });
    }
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
    const reviewText = req.query.review; // Retrieve the review text from the query parameter
    const token = req.session.token; // Retrieve the JWT token from the session (set during login)

    // Verify the token (you can use middleware for this)
    try {
        const decoded = jwt.verify(token, 'your-secret-key'); // Verify the token
        const username = decoded.username; // Extract the username from the token

        // Find the book with the matching ISBN
        const book = books[requestedISBN];

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Add or modify the review
        if (book.reviews && book.reviews[username]) {
            // User has already reviewed this book, modify the existing review
            book.reviews[username] = reviewText;
        } else {
            // User is posting a new review
            if (!book.reviews) {
                book.reviews = {}; // Initialize the reviews object if it doesn't exist
            }
            book.reviews[username] = reviewText;
        }

        return res.status(200).json({ message: 'Review added/modified successfully' });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
});

module.exports.general = public_users;
