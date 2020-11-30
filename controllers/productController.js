const Product = require("../models/product.model.js");

exports.findAll = (req, res) => {
  Product.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Product.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Product not found") {
        res.status(404).send({
          message: `Not found Product with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Product with id: " + req.params.id
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

  const product = new Product({
    vat_id: req.body.vat_id,
    name: req.body.name,
    price: req.body.price
  });

  Product.create(product, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Error adding Product."
      });
    else res.send(data);
  });
};

exports.update = function (req, res) {
  Product.updateById(
    req.params.id,
    new Product(req.body),
    (err, data) => {
      if (err) {
        if (err.error === "Product not found") {
          res.status(404).send({
            message: `Not found Product with id: ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Product with id: " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = function (req, res) {
  Product.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Product not found") {
        res.status(404).send({
          message: `Not found Product with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Product with id: " + req.params.id
        });
      }
    } else res.send({ message: `Product deleted successfully!` });
  });
};