const sql = require("./dbconn.js");

const Customer = function (customer) {
  this.first_name = customer.first_name,
    this.last_name = customer.last_name,
    this.email = customer.email,
    this.address = customer.address,
    this.brand_name = customer.brand_name,
    this.nip = customer.nip
};

Customer.getAll = result => {
  sql.query("SELECT * FROM customer", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    console.log("customers: ", res);
    result(null, res);
  });
};

Customer.getById = function (id, result) {
  sql.query("SELECT * FROM customer where id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({error: "Customer not found"}, null);
      return;
    }

    console.log("Found customer: ", res[0]);
    result(null, res[0]);


    console.log("customer: ", res);
    result(null, res);
  });
};

Customer.getByNip = function (nip, result) {
  sql.query("SELECT * FROM customer where nip = ?", nip, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length <= 0) {
      err = "Customer cannot be null";
      result({ error: "Customer not found" }, null);
      return;
    }

    console.log("Found customer: ", res[0]);
    result(null, res[0]);
    return;
  });
};

Customer.create = (newCustomer, result) => {
  sql.query("INSERT INTO customer SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created customer: ", { id: res.insertId });
    result(null, { id: res.insertId, ...newCustomer });
  });
};

Customer.updateById = (id, customer, result) => {
  sql.query("UPDATE customer SET first_name=?, last_name=?, email=?, address=?, brand_name=?, nip=? WHERE id=?",
    [customer.first_name, customer.last_name, customer.email, customer.address, customer.brand_name, customer.nip, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Customer not found" }, null);
        return;
      }

      console.log("updated customer: ", { id: id, ...customer });
      result(null, { id: id, ...customer });
    });
};

Customer.delete = (id, result) => {
  sql.query("DELETE FROM customer WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted customer with id: ", id);
    result(null, res);
  });
};

module.exports = Customer;