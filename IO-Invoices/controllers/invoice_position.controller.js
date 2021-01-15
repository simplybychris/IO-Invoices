const Invoice_position = require("../models/invoice_position.model.js");

exports.findAll = (req, res) => {
  Invoice_position.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving invoice_positions.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Invoice_position.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Invoice_position not found") {
        res.status(404).send({
          message: `Not found Invoice_position with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving Invoice_position with id: " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.create = function (req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Values can not be empty!",
    });
  }

  const invoice_position = new Invoice_position({
    invoice_id: req.body.invoice_id,
    name: req.body.name,
    product_id: req.body.product_id,
    quantity: req.body.quantity,
    unit_price: req.body.unit_price,
    total: req.body.total,
  });

  Invoice_position.create(invoice_position, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error adding Invoice_position.",
      });
    else res.send(data);
  });
};

exports.update = function (req, res) {
  const invoice_position = new Invoice_position({
    invoice_id: req.params.id,
    quantity: req.body.quantity,
  });

  Invoice_position.updateById(req.params.id, invoice_position, (err, data) => {
    if (err) {
      if (err.error === "Invoice_position not found") {
        res.status(404).send({
          message: `Not found Invoice_position with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Invoice_position with id: " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.delete = function (req, res) {
  Invoice_position.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Invoice_position not found") {
        res.status(404).send({
          message: `Not found Invoice_position with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete Invoice_position with id: " + req.params.id,
        });
      }
    } else res.send({ message: `Invoice_position deleted successfully!` });
  });
};
