const express = require('express'),
  router = express.Router(),
  vatController = require('../controllers/vat.controller.js');

// get all vats
router.get('/', vatController.findAll);

// get vat by id
router.get('/:id', vatController.findOne);

// create new vat
router.post('/', vatController.create);

// update vat by id
router.put('/:id', vatController.update);

// delete vat by id
router.delete('/:id', vatController.delete);

module.exports = router;