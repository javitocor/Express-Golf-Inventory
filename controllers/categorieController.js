var Item = require('../models/item');
var Categorie = require('../models/categorie');

const { body,validationResult } = require("express-validator");

var async = require('async');
// shows a single categorie details
exports.category_detail = function(req, res) {
  async.parallel({
    category: function(callback) {

      Categorie.findById(req.params.id)
          .exec(callback);
    },

    category_item: function(callback) {
      Item.find({ 'categorie': req.params.id })
      .exec(callback);
    },

  }, function(err, results) {
    if (err) { return next(err); }
    if (results.categorie==null) { // No results.
        var err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }
    // Successful, so render.
    res.render('category_detail', { title: 'Category Detail', category: results.category, category_item: results.category_item } );
  });
}
// shows a list of all categories
exports.category_list = function(req, res) {
  Categorie.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_categories) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('categories_list', { title: 'Categorie List', list_categories:  list_categories});
    });
}