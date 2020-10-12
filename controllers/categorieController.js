var Item = require('../models/item');
var Categorie = require('../models/categorie');

const { body, validationResult } = require("express-validator");

var async = require('async');
// shows a single categorie details
exports.category_detail = function (req, res) {
  async.parallel({
    category: function (callback) {

      Categorie.findById(req.params.id)
        .exec(callback);
    },

    category_item: function (callback) {
      Item.find({ 'categorie': req.params.id })
        .exec(callback);
    },

  }, function (err, results) {
    if (err) { return next(err); }
    if (results.categorie == null) { // No results.
      var err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render('category_detail', { title: 'Category Detail', category: results.category, category_item: results.category_item });
  });
}
// shows a list of all categories
exports.category_list = function (req, res) {
  Categorie.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_categories) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('categories_list', { title: 'Categorie List', list_categories: list_categories });
    });
}

exports.category_create_get = function (req, res) {
  res.render('category_form', { title: 'Create Category' });
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
      res.render('category_form', { title: 'Create Category', category: category, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.
      // Check if category with same name already exists.
      Categorie.findOne({ 'name': req.body.name })
        .exec(function (err, found_cat) {
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
exports.category_update_get = function (req, res) {
  Categorie.findById(req.params.id, function (err, cat) {
    if (err) { return next(err); }
    if (cat == null) { // No results.
      var err = new Error('Categorie not found');
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render('category_form', { title: 'Update Category', cat: cat });
  });
}
exports.category_update_post = [

  // Validate and sanitze the name field.
  body('name', 'Name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
    var category = new Genre(
      {
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id
      }
    );


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('category_form', { title: 'Update Category', category: category, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid. Update the record.
      Categorie.findByIdAndUpdate(req.params.id, category, {}, function (err, thecat) {
        if (err) { return next(err); }
        // Successful - redirect to genre detail page.
        res.redirect(thecat.url);
      });
    }
  }
];
exports.category_delete_get = function (req, res) {
  async.parallel({
    category: function (callback) {
      Categorie.findById(req.params.id).exec(callback);
    },
    cat_items: function (callback) {
      Item.find({ 'categorie': req.params.id }).exec(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.category == null) { // No results.
      res.redirect('/catalog/categories');
    }
    // Successful, so render.
    res.render('category_delete', { title: 'Delete Category', category: results.category, cat_items: results.cat_items });
  });
}
exports.category_delete_post = function (req, res) {
  async.parallel({
    category: function (callback) {
      Categorie.findById(req.params.id).exec(callback);
    },
    cat_items: function (callback) {
      Item.find({ 'categorie': req.params.id }).exec(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    // Success
    if (results.cat_items.length > 0) {
      // Cat has itms. Render in same way as for GET route.
      res.render('category_delete', { title: 'Delete Category', category: results.category, cat_items: results.cat_items });
      return;
    }
    else {
      // Genre has no books. Delete object and redirect to the list of categories.
      Categorie.findByIdAndRemove(req.body.id, function deleteGenre(err) {
        if (err) { return next(err); }
        // Success - go to categories list.
        res.redirect('/catalog/categories');
      });

    }
  });
}