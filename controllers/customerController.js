const Customer = require("../models/customer.model.js");

exports.findAll = (req, res) => {
  Customer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Customer.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Customer not found") {
        res.status(404).send({
          message: `Not found Customer with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id: " + req.params.id
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

  const customer = new Customer({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    address: req.body.address,
    brand_name: req.body.brand_name,
    nip: req.body.nip
  });

  Customer.create(customer, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Error adding Customer."
      });
    else res.send(data);
  });
};

exports.update = function (req, res) {
  Customer.updateById(
    req.params.id,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.error === "Customer not found") {
          res.status(404).send({
            message: `Not found Customer with id: ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id: " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = function (req, res) {
  Customer.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Customer not found") {
        res.status(404).send({
          message: `Not found Customer with id: ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id: " + req.params.id
        });
      }
    } else res.send({ message: `Customer deleted successfully!` });
  });
};