const sql = require("./dbconn.js");

//https://bezkoder.com/node-js-rest-api-express-mysql/

//constructor
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
        return;
      }
      console.log("customers: ", res);
      result(null, res);
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
        result(null, {id: res.insertId, ...newCustomer });
    });
};

Customer.delete = (newCustomer, result) => {
  sql.query("INSERT INTO customer SET ?", newCustomer, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }
      console.log("Created customer: ", { id: res.insertId });
      result(null, {id: res.insertId, ...newCustomer });
  });
};

module.exports = Customer;