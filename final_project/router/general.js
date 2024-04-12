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

//public_users.get('/author/:author',function (req, res) {
  //Write your code here

public_users.get("/author/:author", function (req, res) {
    /*let bookarry = Object.values(books);
    const getbookbyauthors = bookarry.filter(
        (book) => book.author == req.params.author
    );*/
    const getbooksbyauthor = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let all_isbn = Object.keys(books);
    all_isbn.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,"title":books[isbn]["title"],"reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
    }


    });
    reject(res.send("The mentioned author does not exist "))
    
});

      /*return res.status(200).json({
        message: "booksbyauthor",
        data: getbookbyauthors,
      });
    } else {
      res.json({ message: "Invalid author name" }).status(404);
    }
  });*/
  //axios with async and await  you ned to call this  getaxiosbasonauthor(req.params.author);;
  
  async function getaxiosbasonauthor(author) {
    await axios
      .get(`http://172.22.138.176:5000/author/${author}`)
      .then((response) => {
        return console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

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
    
  const getbooksbytitle = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let all_isbn = Object.keys(books);
    all_isbn.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,"author":books[isbn]["author"],"reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
    }


    });
    reject(res.send("The mentioned author does not exist "))
    
});
  
  /*const title = req.params.title;

    let filtered_books = Object.entries(books).filter(([isbn, info]) => info.title === title)
    res.send(filtered_books);*/
  
    //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
