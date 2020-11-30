const express = require('express'),
  router = express.Router(),
  invoiceController = require('../controllers/invoiceController');

// get all invoices
router.get('/', invoiceController.findAll);

// get invoice by id
router.get('/:id', invoiceController.findOne);

// create new user
router.post('/', invoiceController.create);

// update invoice by id
router.put('/:id', invoiceController.update);

// delete invoice by id
router.delete('/:id', invoiceController.delete);

module.exports = router;