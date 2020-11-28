const express = require('express'),
  router = express.Router(),
  productController = require('../controllers/productController');

  router.get('/', productController.findAll);

module.exports = router;

