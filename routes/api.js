/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const BookModel = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookModel.find({}, function(err, book) {
        if (err || !book) {
          res.json({error: "could not get data"})
        }
        else {
          res.json(book);
        }
        });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send('missing required field title');
        return;
      }
      const newBook = new BookModel({
        title: title,
        commentcount: 0,
        count: [],
      }); 
      newBook.save((err,data) => {
            if (err || !data) {
              res.send("Error saving in post");
            } 
            else {
              res.json({title: newBook.title, _id: newBook._id});
            }
        });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      BookModel.deleteMany({}, (err, book) => {
        if (err || !book) {
          res.send("delete failed")
        }
        else {
          res.send("complete delete successful")
        }
          })
        })
     



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findOne({ _id: bookid }, function(err, book) {
        if (err || !book) {
          res.send("no book exists");
        } 
        else {
          res.json({title: book.title, _id: book._id, comments: book.comments});
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!bookid) {
        res.send("missing required field title")
        return;
      }
      if (!comment) {
        res.send("missing required field comment")
        return;
      }
      BookModel.findOne({ _id: bookid }, (err, book) => {
        if (err || !book) {
          res.send("no book exists")
        }
        else {
          book.comments.push(comment);
          book.commentcount++;
          book.save((err, bookdata) => {
            if (err || !bookdata) {
              res.json({ error: "could not update"});
            } 
            else {
              res.json({title: bookdata.title, _id: bookdata._id, comments: bookdata.comments})
            }
          })
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (!bookid) {
        res.send("missing required field id")
        return;
      }
      
      BookModel.findOne({ _id: bookid }, (err, book) => {
        if (err || !book) {
          res.send("no book exists")
        }
        else {
          book.delete((err, bookdata) => {
            if (err || !bookdata) {
              res.json({ error: "could not delete"});
            } 
            else {
              res.send("delete successful")
            }
          })
        }
      })
    });
  
};
