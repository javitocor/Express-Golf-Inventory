var Item = require('../models/item');
var Categorie = require('../models/categorie');

const { body,validationResult } = require("express-validator");

var async = require('async');

exports.index = function(req, res) {

}

exports.item_detail = function(req, res) {

}

exports.item_list = function(req, res) {
  Item.find({}, 'title categorie')
    .populate('categorie').exec(function (err, list_items) {
      if (err) {return next(err)} 
      else {
            // Successful, so render
            res.render('items_list', { title: 'Book List', item_list:  list_items});
        }
    });
}

