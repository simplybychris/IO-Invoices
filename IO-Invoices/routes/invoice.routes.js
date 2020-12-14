const express = require("express"),
  router = express.Router(),
  invoiceController = require("../controllers/invoice.controller");

// get all invoices
router.get("/", invoiceController.findAllVue);

// get invoice by id
router.get("/:id", invoiceController.findOne);

// create new invoice
router.post("/", invoiceController.create);

// new invoice method
router.post("/add", invoiceController.add);

// update invoice by id
router.put("/:id", invoiceController.update);

// delete invoice by id
router.delete("/:id", invoiceController.delete);

module.exports = router;
