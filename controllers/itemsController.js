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
    res.render('index', { title: 'Inventory Home', error: err, data: results });
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

