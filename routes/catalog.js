var express = require('express');
var router = express.Router();


// Require controllers.
var item_controller = require('../controllers/itemsController'); 
var category_controller = require('../controllers/categorieController');

// Item routes

// GET catalog home page.
router.get('/', item_controller.index);
//GET&POST request to create item
router.get('/item/create', item_controller.item_create_get)
router.post('/item/create', item_controller.item_create_post)  
// GET request for one Item.
router.get('/item/:id', item_controller.item_detail);
// GET request for list of all Items.
router.get('/items', item_controller.item_list);
//GET&POST request to update item
router.get('/item/:id/update', item_controller.item_update_get)
router.post('/item/:id/update', item_controller.item_update_post)
//GET&POST request to delete item
router.get('/item/:id/delete', item_controller.item_delete_get)
router.post('/item/:id/delete', item_controller.item_delete_post)

// Categorie routes

//GET&POST request to create category
router.get('/category/create', category_controller.category_create_get)
router.post('/category/create', category_controller.category_create_post)
// GET request for one Category.
router.get('/category/:id', category_controller.category_detail);
// GET request for list of all Categories.
router.get('/categories', category_controller.category_list);
//GET&POST request to update category
router.get('/category/:id/update', category_controller.category_update_get)
router.post('/category/:id/update', category_controller.category_update_post)
//GET&POST request to delete category
router.get('/category/:id/delete', category_controller.category_delete_get)
router.post('/category/:id/delete', category_controller.category_delete_post)

module.exports = router;


