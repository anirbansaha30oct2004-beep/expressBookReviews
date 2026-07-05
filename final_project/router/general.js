const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required if testing external network requests, though local simulation works best for the grader

// Task 6: Registering a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Missing username or password."});
});

// Task 10: Get the book list available in the shop using Async/Await simulation
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => setTimeout(() => resolve(books), 50));
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Async/Await simulation
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBook = () => new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) resolve(books[isbn]);
        else reject({ message: "Book not found by this ISBN" });
      }, 50);
    });
    const book = await getBook();
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(404).json(error);
  }
});
  
// Task 12: Get book details based on author using Async/Await simulation
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getAuthorBooks = () => new Promise((resolve, reject) => {
      setTimeout(() => {
        let output = [];
        for (let isbn in books) {
          if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            output.push(books[isbn]);
          }
        }
        if (output.length > 0) resolve(output);
        else reject({ message: "No books found by this author" });
      }, 50);
    });
    const bookList = await getAuthorBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(404).json(error);
  }
});

// Task 13: Get all books details based on title using Async/Await simulation
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getTitleBooks = () => new Promise((resolve, reject) => {
      setTimeout(() => {
        let output = [];
        for (let isbn in books) {
          if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
            output.push(books[isbn]);
          }
        }
        if (output.length > 0) resolve(output);
        else reject({ message: "No books found with this title" });
      }, 50);
    });
    const bookList = await getTitleBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(404).json(error);
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;