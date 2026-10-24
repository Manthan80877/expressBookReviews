const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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

// Task 1/11: Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books);
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({message: "Error fetching book list for debugging"});
  }
});

// Task 2/12: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found. Please check the ISBN."});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching book details for debugging"});
  }
});
  
// Task 3/13: Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
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
    return res.status(500).json({message: "Error fetching author details for debugging"});
  }
});

// Task 4/14: Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
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
    return res.status(500).json({message: "Error fetching title details for debugging"});
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

// Task 11: Get all books using async/await and Axios
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// Task 12: Search by ISBN using async/await and Axios
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// Task 13: Search by Author using async/await and Axios
async function getBookByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// Task 14: Search by Title using async/await and Axios
async function getBookByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}