const express = require('express');
const axios = require("axios").default;
//const bookarry = Object.values(books);
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message: `Customer ${username} has been successfully registered. Now you can log in`});
    }
    else{
        return res.status(404).json({message: "Username already exists, try again"});
    }
  }
  return res.status(404).json({message: "Please provide valid details"});


  //return res.status(300).json({message: "Yet to be implemented"});
});



// Get the book list available in the shop
  //Write your code here
  function getListOfBooks(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
  }

  public_users.get('/',function (req, res) {
    getListOfBooks().then(
      (book)=>res.send(JSON.stringify(book, null, 4)),
      (error) => res.send("denied")
    );  
  });
  
  
  /*res.send(JSON.stringify(books,null,4)); - Task 1*/


// Get book details based on ISBN
  //Write your code here

  function getBasedOnISBN(isbn){
    let book_ISBN = books[isbn];

    return new Promise((resolve,reject)=>{
      if (book_ISBN) {
        resolve(book_ISBN);
      }else{
        reject("The book you are looking for is unavailable!");
      }    
    })
  }
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;

    getBasedOnISBN(isbn).then(
      (book)=>res.send(JSON.stringify(book, null, 4)),
      (error) => res.send("ISBN not found")
    )


/*const isbn = req.params.isbn;
  res.send(books[isbn]) -Task 2*/
});

  
// Get book details based on author

//public_users.get('/author/:author',function (req, res) {
  //Write your code here

public_users.get("/author/:author", function (req, res) {
    
    function getFromAuthor(author){
        let output = [];
        return new Promise((resolve,reject)=>{
          for (var isbn in books) {
            let book_ISBN = books[isbn];
            if (book_ISBN.author === author){
              output.push(book_ISBN);
            }
          }
          resolve(output);  
        })
      }
      // Get book details based on author
      public_users.get('/author/:author',function (req, res) {
        const author = req.params.author;
        getFromAuthor(author)
        .then(
          result =>res.send(JSON.stringify(result, null, 4))
        );
      });
    
});
 /*let booksbyauthor = [];
    let all_isbn = Object.keys(books);
    all_isbn.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,"title":books[isbn]["title"],"reviews":books[isbn]["reviews"]});
    return res.send(JSON.stringify({booksbyauthor}, null, 4));
    }


    });
    return res.send("The mentioned author does not exist ")*/ /* - Task 3*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    
  const getbooksbytitle = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let all_isbn = Object.keys(books);
    all_isbn.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,"author":books[isbn]["author"],"reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
    }


    });
    reject(res.send("The mentioned title does not exist "))
    
});
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
