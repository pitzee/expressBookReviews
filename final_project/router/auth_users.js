const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
