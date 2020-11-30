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
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    address: req.body.address,
    brand_name: req.body.brand_name,
    nip: req.body.nip
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