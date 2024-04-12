const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const existingUser = users.filter((user) => user.username === username);
return existingUser.length > 0 ? true:false; 
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const matchUsers = users.filter((user) => user.username === username && user.password === password);
    return matchUsers.length > 0 ? true:false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Error logging in. Please check username and password!"})
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = { accessToken, username }
    return res.json({message: "User successfully logged in!"})
  }
  return res.status(208).json({message: "Invalid Login. Please check username and password!"});

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let selectedBook = books[isbn]
  
  if(selectedBook){
        let review = req.query.review;
        let reviewer = req.session.authorization.username;
        if(review){
            selectedBook['reviews'][reviewer] = review;
            books[isbn] = selectedBook;
        }
        res.json({message: `The review for the book with ISBN ${isbn} has been added/updated`});
  }
  else{
    res.status(404).json({message: `Book with ISBN ${isbn} not found!`});
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization.username;
    let selectedBook = books[isbn]['reviews'];

    if (selectedBook[reviewer]){
        delete selectedBook[reviewer];
        res.json({message: `Reviews for the book with ISBN ${isbn} posted by the user ${reviewer} has been deleted`});
    }
    else{
        res.status(404).json({message: `Unsusccessful deletion, this review was written by another user`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
