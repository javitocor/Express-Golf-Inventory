var Item = require('../models/item');
var Categorie = require('../models/categorie');

const { body,validationResult } = require("express-validator");

var async = require('async');

exports.index = function(req, res) {
  async.parallel({
    item_count: function(callback) {
        Item.count(callback);
    },
    categorie_count: function(callback) {
        Categorie.count(callback);
    },
  }, function(err, results) {
      res.render('index', { title: 'Golf Equipment Home', error: err, data: results });
  });
}
// shows one item details
exports.item_detail = function(req, res) {
  async.parallel({
    item: function(callback) {

      Item.findById(req.params.id)
          .populate('categorie')
          .exec(callback);
    }
}, function(err, results) {
    if (err) { return next(err); }
    if (results.item==null) { // No results.
        var err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }
    // Successful, so render.
    res.render('item_detail', { title: 'Title', item:  results.item } );
});
}
// shows list of all items
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

exports.item_create_get = function(req, res) {
  async.parallel({
    items: function(callback) {
        Item.find(callback);
    },
    categories: function(callback) {
        Categorie.find(callback);
    },
}, function(err, results) {
    if (err) { return next(err); }
    res.render('item_form', { title: 'Create Item', items:results.items, categories:results.categories });
});

}
exports.item_create_post = [
  (req, res, next) => {
    if(!(req.body.categorie instanceof Array)){
        if(typeof req.body.categorie==='undefined')
        req.body.categorie=[];
        else
        req.body.categorie=new Array(req.body.categorie);
    }
    next();
},

// Validate and sanitize fields.
body('name', 'Name must not be empty.').isLength({ min: 1 }).trim().escape(),
body('description', 'Description must not be empty.').isLength({ min: 1 }).trim().escape(),
body('stock', 'Stock must not be empty.').isLength({ min: 1 }).trim().escape(),
body('price', 'Price must not be empty').isLength({ min: 1 }).trim().escape(),
body('categorie.*').escape(),
// Process request after validation and sanitization.
(req, res, next) => {
    

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    var item = new Item(
      { name: req.body.name,
        description: req.body.description,
        categorie: req.body.categorie,
        stock: req.body.stock,
        price: req.body.price
       });

    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.

        // Get all items and categories for form.
        async.parallel({
            items: function(callback) {
                Item.find(callback);
            },
            categories: function(callback) {
                Categorie.find(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }

            // Mark our selected categories as checked.
            for (let i = 0; i < results.categories.length; i++) {
                if (book.categories.indexOf(results.categories[i]._id) > -1) {
                    results.categories[i].checked='true';
                }
            }
            res.render('item_form', { title: 'Create Item',items:results.items, categories:results.categories, item: item, errors: errors.array() });
        });
        return;
    }
    else {
        // Data from form is valid. Save item.
        item.save(function (err) {
            if (err) { return next(err); }
               // Successful - redirect to new item record.
               res.redirect(item.url);
            });
    }
}
];
exports.item_update_get = function(req, res) {
  
  async.parallel({
    item: function(callback) {
        Item.findById(req.params.id).populate('categorie').exec(callback);
    },
    categories: function(callback) {
        Categorie.find(callback);
    },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected categories as checked.
        for (var all_g_iter = 0; all_g_iter < results.categories.length; all_g_iter++) {
            for (var item_g_iter = 0; item_g_iter < results.item.categorie.length; item_g_iter++) {
                if (results.categories[all_g_iter]._id.toString()==results.item.categorie[item_g_iter]._id.toString()) {
                    results.categories[all_g_iter].checked='true';
                }
            }
        }
        res.render('item_form', { title: 'Update Item', items:results.items, categories:results.categories });
    });
}
exports.item_update_post  = [

  // Convert the genre to an array.
  (req, res, next) => {
      if(!(req.body.categorie instanceof Array)){
          if(typeof req.body.categorie==='undefined')
          req.body.categorie=[];
          else
          req.body.categorie=new Array(req.body.categorie);
      }
      next();
  },
 
  // Validate and santitize fields.
  body('name', 'Name must not be empty.').isLength({ min: 1 }).trim().escape(),
  body('description', 'Description must not be empty.').isLength({ min: 1 }).trim().escape(),
  body('price', 'price must not be empty.').isLength({ min: 1 }).trim().escape(),
  body('stock', 'stock must not be empty').isLength({ min: 1 }).trim().escape(),
  body('categorie.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Book object with escaped/trimmed data and old id.
      var item = new Book(
        { name: req.body.name,
          description: req.body.description,
          stock: req.body.stock,
          price: req.body.price,
          categorie: (typeof req.body.categorie==='undefined') ? [] : req.body.categorie,
          _id:req.params.id // This is required, or a new ID will be assigned!
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all authors and genres for form
          async.parallel({
              items: function(callback) {
                  Item.find(callback);
              },
              categories: function(callback) {
                  Categorie.find(callback);
              },
          }, function(err, results) {
              if (err) { return next(err); }

              // Mark our selected genres as checked.
              for (let i = 0; i < results.categories.length; i++) {
                  if (item.categorie.indexOf(results.categories[i]._id) > -1) {
                      results.categories[i].checked='true';
                  }
              }
              res.render('index_form', { title: 'Update Index',items:results.items, categories:results.categories, item: item, errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid. Update the record.
          Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
              if (err) { return next(err); }
                 // Successful - redirect to book detail page.
                 res.redirect(thebook.url);
              });
      }
  }
];
exports.item_delete_get = function(req, res) {
  async.parallel({
    item: function(callback) {
        Item.findById(req.body.id).populate('categorie').exec(callback);
    },
    categories: function(callback) {
        Categorie.find({ 'item': req.body.id }).exec(callback);
    },
}, function(err, results) {
    if (err) { return next(err); }
    // Success
    if (results.categories.length > 0) {
        // Book has book_instances. Render in same way as for GET route.
        res.render('book_delete', { title: 'Delete Item', item: results.item, categories: results.categories } );
        return;
    }
    else {
        // Book has no BookInstance objects. Delete object and redirect to the list of books.
        Item.findByIdAndRemove(req.body.id, function deleteBook(err) {
            if (err) { return next(err); }
            // Success - got to books list.
            res.redirect('/catalog/items');
        });

    }
});
}
exports.item_delete_post = function(req, res) {
  async.parallel({
    item: function(callback) {
        Item.findById(req.params.id).populate('categorie').exec(callback);
    },
    categories: function(callback) {
        Categorie.find(callback);
    },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected genres as checked.
        for (var all_g_iter = 0; all_g_iter < results.categories.length; all_g_iter++) {
            for (var item_g_iter = 0; book_g_iter < results.item.genre.length; item_g_iter++) {
                if (results.categories[all_g_iter]._id.toString()==results.item.genre[item_g_iter]._id.toString()) {
                    results.categories[all_g_iter].checked='true';
                }
            }
        }
        res.render('item_form', { title: 'Update item', categories:results.categories, item: results.item });
    });
}

