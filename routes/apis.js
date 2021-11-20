const express = require('express');
const productController = require('../controllers/productController');
const clientController = require('../controllers/clientController');
//define a router and create routes
const router = express.Router();

//routes for dynamic processing of products
//-----------------------------------------------

//route for registration
router.post('/api/register',clientController.registerControl);
//route for login
router.get('/api/login', clientController.loginControl);
router.post('/api/clients', clientController.getClients);
router.post('/api/clients/:id', clientController.getClientByNumclient);
//route for listing all products
router.get('/api/catalogue', productController.getCatalogue);
router.get('/api/article/:id', productController.getProductByID);

//export router
module.exports = router;