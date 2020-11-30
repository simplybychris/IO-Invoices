const Invoice = require("../models/invoice.model.js");

exports.findAll = (req, res) => {
  Invoice.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Invoice.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Invoice not found") {
        res.status(404).send({
          message: `Not found Invoice with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Invoice with id: " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.create = function (req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Values can not be empty!"
    });
  }

  const invoice = new Invoice({
    customer_id: req.body.id,
    seller_id: req.body.seller_id,
    invoice_position_id: req.body.invoice_position_id,
    invoice_date: req.body.invoice_date,
    due_date: req.body.due_date,
    invoice_status_id: req.body.invoice_status_id,
    total: req.body.total
  });

  Invoice.create(invoice, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Error adding Invoice."
      });
    else res.send(data);
  });
};

exports.update = function (req, res) {
  Invoice.updateById(
    req.params.id,
    new Invoice(req.body),
    (err, data) => {
      if (err) {
        if (err.error === "Invoice not found") {
          res.status(404).send({
            message: `Not found Invoice with id: ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Invoice with id: " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = function (req, res) {
  Invoice.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Invoice not found") {
        res.status(404).send({
          message: `Not found Invoice with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Invoice with id: " + req.params.id
        });
      }
    } else res.send({ message: `Invoice deleted successfully!` });
  });
};