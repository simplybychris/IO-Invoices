const Vat = require("../models/vat.model.js");

exports.findAll = (req, res) => {
  Vat.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vat."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Vat.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Vat not found") {
        res.status(404).send({
          message: `Not found Vat with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Vat with id: " + req.params.id
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

  const vat = new Vat({
    vat_id: req.body.vat_id,
    name: req.body.name,
    price: req.body.price
  });

  Vat.create(vat, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Error adding Vat."
      });
    else res.send(data);
  });
};

exports.update = function (req, res) {
  Vat.updateById(
    req.params.id,
    new Vat(req.body),
    (err, data) => {
      if (err) {
        if (err.error === "Vat not found") {
          res.status(404).send({
            message: `Not found Vat with id: ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Vat with id: " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = function (req, res) {
  Vat.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Vat not found") {
        res.status(404).send({
          message: `Not found Vat with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Vat with id: " + req.params.id
        });
      }
    } else res.send({ message: `Vat deleted successfully!` });
  });
};