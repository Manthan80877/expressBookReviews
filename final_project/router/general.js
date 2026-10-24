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

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push({
        "isbn": isbn,
        "title": books[isbn].title,
        "reviews": books[isbn].reviews
      });
    }
  }
  
  return res.status(200).send(JSON.stringify({booksbyauthor: booksByAuthor}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push({
        "isbn": isbn,
        "author": books[isbn].author,
        "reviews": books[isbn].reviews
      });
    }
  }
  
  return res.status(200).send(JSON.stringify({booksbytitle: booksByTitle}, null, 4));
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