const express = require('express'),
  router = express.Router(),
  invoice_statusController = require('../controllers/invoice_status.controller.js');

// get all invoice_statuses
router.get('/', invoice_statusController.findAll);

// get invoice_status by id
router.get('/:id', invoice_statusController.findOne);

// create new user
router.post('/', invoice_statusController.create);

// update invoice_status by id
router.put('/:id', invoice_statusController.update);

// delete invoice_status by id
router.delete('/:id', invoice_statusController.delete);

module.exports = router;