const Customer = require("../models/customer.model.js");

// function getCustomerFromRec(req) {
//     const Customer = {
        
//     };

//     return Customer;
// }

//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

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

exports.customer_detail = function (req, res) {
    let sql = `SELECT * FROM customer where id=${req.params.id}`;
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        if (!data.length) {
            res.status(404).json({
                message: "Customer not found"
            })
        } else {
            res.json({
                status: 200,
                data,
                message: "Customer retrieved successfully"
            })
        }
    })
};

exports.customer_create_post = function (req, res) {
    let sql = `INSERT INTO customer(first_name, last_name, email, address, brand_name, nip) VALUES (?)`;
    let values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.address,
        req.body.brand_name,
        req.body.nip
    ];
    db.query(sql, [values], function (err, data, fields) {
        if (err) throw err;
        res.json({
            status: 200,
            message: "New customer added successfully"
        })
    })
};