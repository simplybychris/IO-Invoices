const express = require('express'),
  router = express.Router(),
  invoice_positionController = require('../controllers/invoice_position.controller.js');

// get all invoice_positions
router.get('/', invoice_positionController.findAll);

// get invoice_position by id
router.get('/:id', invoice_positionController.findOne);

// create new user
router.post('/', invoice_positionController.create);

// update invoice_position by id
router.put('/:id', invoice_positionController.update);

// delete invoice_position by id
router.delete('/:id', invoice_positionController.delete);

module.exports = router;