var express = require('express');
var router = express.Router();


// Require controllers.
var item_controller = require('../controllers/itemsController'); 
var categorie_controller = require('../controllers/categorieController');

// Item routes

// GET catalog home page.
router.get('/', item_controller.index);  
// GET request for one Item.
router.get('/item/:id', item_controller.item_detail);
// GET request for list of all Items.
router.get('/items', item_controller.item_list);
//GET&POST request to create item
router.get('/item/create', item_controller.item_create_get)
router.post('/item/create', item_controller.item_create_post)
//GET&POST request to update item
router.get('/item/:id/update', item_controller.item_update_get)
router.post('/item/:id/update', item_controller.item_update_post)
//GET&POST request to delete item
router.get('/item/:id/delete', item_controller.item_delete_get)
router.post('/item/:id/delete', item_controller.item_delete_post)

// Categorie routes

// GET request for one Categorie.
router.get('/categorie/:id', categorie_controller.categorie_detail);
// GET request for list of all Categories.
router.get('/categories', categorie_controller.categorie_list);
//GET&POST request to create categorie
router.get('/categorie/create', categorie_controller.categorie_create_get)
router.post('/categorie/create', categorie_controller.categorie_create_post)
//GET&POST request to update categorie
router.get('/categorie/:id/update', categorie_controller.categorie_update_get)
router.post('/categorie/:id/update', categorie_controller.categorie_update_post)
//GET&POST request to delete categorie
router.get('/categorie/:id/delete', categorie_controller.categorie_delete_get)
router.post('/categorie/:id/delete', categorie_controller.categorie_delete_post)

module.exports = router;


