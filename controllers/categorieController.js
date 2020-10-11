var Item = require('../models/item');
var Categorie = require('../models/categorie');

const { body,validationResult } = require("express-validator");

var async = require('async');

exports.categorie_detail = function(req, res) {

}

exports.categorie_list = function(req, res) {
  Categorie.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_categories) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('categories_list', { title: 'Categorie List', list_categories:  list_categories});
    });
}