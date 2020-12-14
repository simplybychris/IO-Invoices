const Invoice_status = require("../models/invoice_status.model.js");

exports.findAll = (req, res) => {
  Invoice_status.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoice_statuss."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Invoice_status.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Invoice_status not found") {
        res.status(404).send({
          message: `Not found Invoice_status with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Invoice_status with id: " + req.params.id
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

  const invoice_status = new Invoice_status({
    name: req.body.name
  });

  Invoice_status.create(invoice_status, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Error adding Invoice_status."
      });
    else res.send(data);
  });
};

exports.update = function (req, res) {
  Invoice_status.updateById(
    req.params.id,
    new Invoice_status(req.body),
    (err, data) => {
      if (err) {
        if (err.error === "Invoice_status not found") {
          res.status(404).send({
            message: `Not found Invoice_status with id: ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Invoice_status with id: " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = function (req, res) {
  Invoice_status.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Invoice_status not found") {
        res.status(404).send({
          message: `Not found Invoice_status with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Invoice_status with id: " + req.params.id
        });
      }
    } else res.send({ message: `Invoice_status deleted successfully!` });
  });
};