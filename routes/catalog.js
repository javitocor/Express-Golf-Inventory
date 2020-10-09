var express = require('express');
var router = express.Router();


// Require controllers.
var item_controller = require('../controllers/itemController'); 
var categorie_controller = require('../controllers/categorieController');

// Item routes
// GET catalog home page.
router.get('/', item_controller.index);  

// Categorie routes


