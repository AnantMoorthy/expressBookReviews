const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

function getBookList() {
    return new Promise((res, rej) => {
        res(books);
    });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author

public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
    }


    });
    reject(res.send("The mentioned author does not exist "))
    
});

get_books_author.then(function(){
        console.log("Promise is resolved");
}).catch(function () { 
            console.log('The mentioned author does not exist');
});


   // const author = req.params.author;
   
  
    /* new Promise((resolve, reject) => {
        const filteredObj = Object.fromEntries(
          Object.entries(books).filter(([key, value]) => value.author === author)
        );
        resolve(filteredObj);
      })
        .then((result) => {
          res.send(result);
        })
        .catch((error) => {
          console.log(error);
          res.sendStatus(500);
        });*/

    /*getBookList()
    .then((book_entries) => Object.values(book_entries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filtered_books) => res.status(200).json({message: "booksbyauthor", data: filtered_books}));*/
    
    /*let filtered_books = Object.entries(books).filter(([isbn, info]) => info.author === author)
    res.send(filtered_books);*/

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;

    let filtered_books = Object.entries(books).filter(([isbn, info]) => info.title === title)
    res.send(filtered_books);
  
    //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
