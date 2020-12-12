const express = require('express'),
  router = express.Router(),
  sellerController = require('../controllers/seller.controller.js');

// get all sellers
router.get('/', sellerController.findAll);

// get seller by id
router.get('/:id', sellerController.findOne);

// create new user
router.post('/', sellerController.create);

// update seller by id
router.put('/:id', sellerController.update);

// delete seller by id
router.delete('/:id', sellerController.delete);

module.exports = router;