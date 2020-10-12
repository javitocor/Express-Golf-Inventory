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

exports.category_create_get = function(req, res) {
  res.render('category_form', { title: 'Create Category'});
}
exports.category_create_post = [

  // Validate and santise the name field.
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  body('desription', 'Description required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a category object with escaped and trimmed data.
      var category = new Categorie(
        { 
          name: req.body.name,
          description: req.body.description,
        }
      );


      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('category_form', { title: 'Create Category', category: category, errors: errors.array()});
      return;
      }
      else {
          // Data from form is valid.
          // Check if category with same name already exists.
          Categorie.findOne({ 'name': req.body.name })
              .exec( function(err, found_cat) {
                   if (err) { return next(err); }

                   if (found_cat) {
                       // category exists, redirect to its detail page.
                       res.redirect(found_cat.url);
                   }
                   else {

                    category.save(function (err) {
                         if (err) { return next(err); }
                         // category saved. Redirect to category detail page.
                         res.redirect(category.url);
                       });

                   }

               });
      }
  }
];
exports.category_update_get = function(req, res) {

}
exports.category_update_post = function(req, res) {

}
exports.category_delete_get = function(req, res) {

}
exports.category_delete_post = function(req, res) {
  
}