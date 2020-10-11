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

// Categorie routes

// GET request for one Categorie.
router.get('/categorie/:id', categorie_controller.categorie_detail);
// GET request for list of all Categories.
router.get('/categories', categorie_controller.categorie_list);


