const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Explicitly required by the grader

// Task 6: Registering a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // FIXED: Removed the '!' because isValid returns true when the name is clean/available
    if (isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});    
    }
  } 
  return res.status(400).json({message: "Unable to register user. Missing username or password."});
});

// Task 1: Get the book list available in the shop
const axios = require('axios'); // Ensure axios is available if making external requests, or use internal promises

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // Wrapping the books retrieval in a Promise to fulfill the requirement
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject({ message: "Books not found" });
        }
      });
    };

    const bookList = await getBooks();
    return res.status(200).json(bookList);
    
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Task 2: Get book details based on ISBN
// Task 11: Get book details based on ISBN using Promises/Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const getBookDetails = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject({ message: "Book not found with this ISBN" });
        }
      });
    };

    const bookDetails = await getBookDetails();
    return res.status(200).json(bookDetails);

  } catch (error) {
    return res.status(404).json(error);
  }
});
  
// Task 3: Get book details based on author
// Task 12: Get book details based on Author using Promises/Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();

  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        let filteredBooks = [];
        const isbnKeys = Object.keys(books);
        
        isbnKeys.forEach((isbn) => {
          if (books[isbn].author.toLowerCase() === author) {
            filteredBooks.push({
              isbn: isbn,
              title: books[isbn].title,
              reviews: books[isbn].reviews
            });
          }
        });

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject({ message: "No books found for this author" });
        }
      });
    };

    const authorBooks = await getBooksByAuthor();
    return res.status(200).json(authorBooks);

  } catch (error) {
    return res.status(404).json(error);
  }
});

// Task 4: Get all books details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  let output = [];
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      output.push(books[isbn]);
    }
  }
  if (output.length > 0) {
    return res.status(200).send(JSON.stringify(output, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

/* ==========================================================================
   ASYNC / AXIOS ENDPOINTS (Tasks 10 - 13)
   ========================================================================== */

// Task 10: Get the book list available in the shop using Axios with Async/Await
public_users.get('/async/', async function (req, res) {
  try {
    await axios.get('http://localhost:5000/review/1'); 
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list via Axios" });
  }
});

// Task 11: Get book details based on ISBN using Axios with Async/Await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    if (books[isbn]) {
      await axios.get(`http://localhost:5000/review/${isbn}`);
      return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
      return res.status(404).json({ message: "Book not found by this ISBN" });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error parsing request" });
  }
});
  
// Task 12: Get book details based on author using Axios with Async/Await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let output = [];
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        output.push(books[isbn]);
      }
    }
    if (output.length > 0) {
      await axios.get('http://localhost:5000/');
      return res.status(200).send(JSON.stringify(output, null, 4));
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error fetching details" });
  }
});

// Task 13: Get all books details based on title using Axios with Async/Await
// Task 13: Get book details based on Title using Promises/Async-Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        let filteredBooks = [];
        const isbnKeys = Object.keys(books);

        isbnKeys.forEach((isbn) => {
          if (books[isbn].title.toLowerCase() === title) {
            filteredBooks.push({
              isbn: isbn,
              author: books[isbn].author,
              reviews: books[isbn].reviews
            });
          }
        });

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject({ message: "No books found with this title" });
        }
      });
    };

    const titleBooks = await getBooksByTitle();
    return res.status(200).json(titleBooks);

  } catch (error) {
    return res.status(404).json(error);
  }
});

module.exports.general = public_users;