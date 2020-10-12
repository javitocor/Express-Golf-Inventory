var Item = require('../models/item');
var Categorie = require('../models/categorie');

const { body, validationResult } = require("express-validator");

var async = require('async');

exports.index = function (req, res) {
    async.parallel({
        item_count: function (callback) {
            Item.count(callback);
        },
        categorie_count: function (callback) {
            Categorie.count(callback);
        },
    }, function (err, results) {
        res.render('index', { title: 'Golf Equipment Home', error: err, data: results });
    });
}
// shows one item details
exports.item_detail = function (req, res) {
    async.parallel({
        item: function (callback) {

            Item.findById(req.params.id)
                .populate('categorie')
                .exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.item == null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        console.log(results.item)
        res.render('item_detail', { title: 'Title', item: results.item });
    });
}
// shows list of all items
exports.item_list = function (req, res) {
    Item.find({}, 'name categorie')
        .populate('categorie').exec(function (err, list_items) {
            if (err) { return next(err) }
            else {
                // Successful, so render
                res.render('items_list', { title: 'Item List', item_list: list_items });
            }
        });
}

exports.item_create_get = function (req, res) {
    async.parallel({
        categories: function (callback) {
            Categorie.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create Item', categories: results.categories });
    });

}
exports.item_create_post = [
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined')
                req.body.category = [];
            else
                req.body.category = new Array(req.body.category);
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
            {
                name: req.body.name,
                description: req.body.description,
                categorie: req.body.category,
                stock: req.body.stock,
                price: req.body.price
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all items and categories for form.
            async.parallel({
                items: function (callback) {
                    Item.find(callback);
                },
                categories: function (callback) {
                    Categorie.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }

                // Mark our selected categories as checked.
                for (let i = 0; i < results.categories.length; i++) {
                    if (item.categorie.indexOf(results.categories[i]._id) > -1) {
                        results.categories[i].checked = 'true';
                    }
                }
                res.render('item_form', { title: 'Create Item', items: results.items, categories: results.categories, item: item, errors: errors.array() });
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
exports.item_update_get = function (req, res) {

    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id).populate('categorie').exec(callback);
        },
        categories: function (callback) {
            Categorie.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.item == null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected categories as checked.
        for (var all_g_iter = 0; all_g_iter < results.categories.length; all_g_iter++) {
            for (var item_g_iter = 0; item_g_iter < results.item.categorie.length; item_g_iter++) {
                if (results.categories[all_g_iter]._id.toString() == results.item.categorie[item_g_iter]._id.toString()) {
                    results.categories[all_g_iter].checked = 'true';
                }
            }
        }
        res.render('item_form', { title: 'Update Item', item: results.item, categories: results.categories });
    });
}
exports.item_update_post = [

    // Convert the categorie to an array.
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined')
                req.body.category = [];
            else
                req.body.category = new Array(req.body.category);
        }
        next();
    },

    // Validate and santitize fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim().escape(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim().escape(),
    body('price', 'price must not be empty.').isLength({ min: 1 }).trim().escape(),
    body('stock', 'stock must not be empty').isLength({ min: 1 }).trim().escape(),
    body('category.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var item = new Item(
            {
                name: req.body.name,
                description: req.body.description,
                stock: req.body.stock,
                price: req.body.price,
                categorie: (typeof req.body.category === 'undefined') ? [] : req.body.category,
                _id: req.params.id // This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all items and categories for form
            async.parallel({
                items: function (callback) {
                    Item.find(callback);
                },
                categories: function (callback) {
                    Categorie.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.categories.length; i++) {
                    if (item.categorie.indexOf(results.categories[i]._id) > -1) {
                        results.categories[i].checked = 'true';
                    }
                }
                res.render('index_form', { title: 'Update Index', items: results.items, categories: results.categories, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
                if (err) { return next(err); }
                // Successful - redirect to item detail page.
                res.redirect(theitem.url);
            });
        }
    }
];
exports.item_delete_get = function (req, res) {
    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id).exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.item==null) { // No results.
            res.redirect('/catalog/genres');
        }
        res.render('item_delete', { title: 'Delete Item', item: results.item } );
    });
    // Successful, so render.
    
}
exports.item_delete_post = function (req, res) {
    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id).populate('categorie').exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.item == null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        Item.findByIdAndRemove(req.params.id, function deleteBook(err) {
            if (err) { return next(err); }
            // Success - got to items list.
            res.redirect('/catalog/items');
        });
    });
}

