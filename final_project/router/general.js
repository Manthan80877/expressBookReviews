const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ========================================================
// Centralized error handler function to reduce redundancy
// ========================================================
const handleServerError = (res, error) => {
  console.error("Server Error:", error);
  return res.status(500).json({ message: "Internal server error occurred" });
};

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    let userExists = users.filter((user) => user.username === username);
    if (userExists.length > 0) {
      return res.status(400).json({message: "User already exists"});
    } else {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
  }
  return res.status(400).json({message: "Unable to register user. Please provide username and password"});
});

// Task 1 / Task 11: Get the book list available in the shop
// Purpose: Retrieve all books from the database using async/await
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books);
    return res.status(200).json(allBooks);
  } catch (error) {
    return handleServerError(res, error);
  }
});

// Task 2 / Task 12: Get book details based on ISBN
// Purpose: Retrieve a specific book by its ISBN using async/await and validate input
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Validation: Ensure ISBN parameter is provided
    if (!isbn) {
      return res.status(400).json({ message: "ISBN parameter is required" });
    }
    
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found. Please check the ISBN."});
    }
  } catch (error) {
    return handleServerError(res, error);
  }
});
  
// Task 3 / Task 13: Get book details based on author
// Purpose: Filter and retrieve books written by a specific author using async/await and validate input
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    
    // Validation: Ensure author parameter is provided
    if (!author) {
      return res.status(400).json({ message: "Author parameter is required" });
    }
    
    const booksByAuthor = [];
    const allBooks = await Promise.resolve(books);
    
    for (let isbn in allBooks) {
      if (allBooks[isbn].author === author) {
        let bookWithIsbn = { isbn: isbn, ...allBooks[isbn] };
        booksByAuthor.push(bookWithIsbn);
      }
    }
    
    if (booksByAuthor.length > 0) {
      return res.status(200).json({booksbyauthor: booksByAuthor});
    } else {
      return res.status(404).json({message: "Author not found. Please check the spelling."});
    }
  } catch (error) {
    return handleServerError(res, error);
  }
});

// Task 4 / Task 14: Get all books based on title
// Purpose: Filter and retrieve books that match a specific title using async/await and validate input
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    
    // Validation: Ensure title parameter is provided
    if (!title) {
      return res.status(400).json({ message: "Title parameter is required" });
    }
    
    const booksByTitle = [];
    const allBooks = await Promise.resolve(books);
    
    for (let isbn in allBooks) {
      if (allBooks[isbn].title === title) {
        let bookWithIsbn = { isbn: isbn, ...allBooks[isbn] };
        booksByTitle.push(bookWithIsbn);
      }
    }
    
    if (booksByTitle.length > 0) {
      return res.status(200).json({booksbytitle: booksByTitle});
    } else {
      return res.status(404).json({message: "Title not found. Please check the spelling."});
    }
  } catch (error) {
    return handleServerError(res, error);
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

// ==========================================
// AXIOS FUNCTIONS (Standalone for Tasks 11-14)
// ==========================================

// Purpose: Function to get all books using Axios
async function getAllBooksAxios() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.error("Axios Error:", error.message);
  }
}

// Purpose: Function to get book by ISBN using Axios
async function getBookByISBNAxios(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(response.data);
  } catch (error) {
    console.error("Axios Error:", error.message);
  }
}

// Purpose: Function to get book by Author using Axios
async function getBookByAuthorAxios(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error("Axios Error:", error.message);
  }
}

// Purpose: Function to get book by Title using Axios
async function getBookByTitleAxios(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
  } catch (error) {
    console.error("Axios Error:", error.message);
  }
}