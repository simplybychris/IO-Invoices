const express = require('express'),
  router = express.Router(),
  productController = require('../controllers/product.controller.js');

// get all products
router.get('/', productController.findAll);

// get product by id
router.get('/:id', productController.findOne);

// create new product
router.post('/', productController.create);

// update product by id
router.put('/:id', productController.update);

// delete product by id
router.delete('/:id', productController.delete);

module.exports = router;