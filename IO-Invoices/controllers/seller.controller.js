const Seller = require("../models/seller.model.js");

exports.findAll = (req, res) => {
  Seller.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sellers."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Seller.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Seller not found") {
        res.status(404).send({
          message: `Not found Seller with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Seller with id: " + req.params.id
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

  const seller = new Seller({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    address: req.body.address,
    brand_name: req.body.brand_name,
    nip: req.body.nip
  });

  Seller.create(seller, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Error adding Seller."
      });
    else res.send(data);
  });
};

exports.update = function (req, res) {
  Seller.updateById(
    req.params.id,
    new Seller(req.body),
    (err, data) => {
      if (err) {
        if (err.error === "Seller not found") {
          res.status(404).send({
            message: `Not found Seller with id: ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Seller with id: " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = function (req, res) {
  Seller.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Seller not found") {
        res.status(404).send({
          message: `Not found Seller with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Seller with id: " + req.params.id
        });
      }
    } else res.send({ message: `Seller deleted successfully!` });
  });
};