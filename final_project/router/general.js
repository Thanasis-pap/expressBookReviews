const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!(users.find((user) => user.username === username))) {
            users.push({ username, password });
            return res
                .status(200)
                .json({ message: "User registered succesfully" });
        } else {
            return res.status(404).json({ message: "User exists already" });
        }
    }
    return res.status(404).json({ message: "Error! Cannot register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(books), 600);
    });
    promise.then((result) => {
        return res.status(200).json({ books: result });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(books[req.params.isbn]), 600);
    });
    const book = await promise;
    if (book) {
        return res.status(200).json({ book });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    //Write your code here
    const authorName = req.params.author;
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const selectedBooks = Object.values(books).filter((bk) => bk.author === authorName);
            resolve(selectedBooks);
        }, 600);
    });
    const selectedBooks = await promise;

    if (selectedBooks.length > 0) {
        return res.status(200).json({ books: selectedBooks });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const selectedBooks = Object.values(books).filter(
                (bk) => bk.title === title
            );
            return resolve(selectedBooks);
        }, 600);
    });
    const selectedBooks = await promise;

    if (selectedBooks.length > 0) {
        return res.status(200).json({ books: selectedBooks });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const ISBN = req.params.isbn;

    return res.status(200).json({ reviews: books[ISBN].reviews });
});

module.exports.general = public_users;