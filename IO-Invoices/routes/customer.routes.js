const express = require('express'),
  router = express.Router(),
  customerController = require('../controllers/customer.controller');

// get all customers
router.get('/', customerController.findAll);

// get customer by id
router.get('/:nip', customerController.findOne);

// create new user
router.post('/', customerController.create);

// update customer by id
router.put('/:id', customerController.update);

// delete customer by id
router.delete('/:id', customerController.delete);

module.exports = router;