const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const isValid = (username) => {
    // Customize your validation rules here
    const minLength = 4; // Minimum username length

    // Check if the username meets the criteria
    return typeof username === 'string' && username.length >= minLength;
};

}

const authenticatedUser = (username,password)=>{ //returns boolean
    return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the user by username (you can use a database query here)
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate the password (you should hash and compare securely)
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT with user information
    const token = jwt.sign({ username: user.username }, 'your-secret-key', {
        expiresIn: '1h', // Set the token expiration time (adjust as needed)
    });

    // Save the token in the session (you can use express-session or another method)
    req.session.token = token;

    return res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
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

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const requestedISBN = req.params.isbn; // Retrieve the ISBN from request parameters
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

        // Check if the user has reviewed this book
        if (!book.reviews || !book.reviews[username]) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Delete the user's review
        delete book.reviews[username];

        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
