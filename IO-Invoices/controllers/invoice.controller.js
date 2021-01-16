const sql = require("../models/dbconn.js");
const Vat = require("../models/vat.model.js");
const Invoice = require("../models/invoice.model.js");
const Customer = require("../models/customer.model.js");
const Product = require("../models/product.model.js");
const Invoice_position = require("../models/invoice_position.model.js");
const util = require("util");
const checkNumberPromisified = util.promisify(Vat.checkNumber);
const checkMaxId = util.promisify(Invoice.getMaxId);
const createVat = util.promisify(Vat.create);
const checkIfProductExists = util.promisify(Product.checkIfExists);
const createInvoicePos = util.promisify(Invoice_position.create);
const createProduct = util.promisify(Product.create);
const createCustomer = util.promisify(Customer.create);
const createInvoice = util.promisify(Invoice.create);
const checkIfCustomerExists = util.promisify(Customer.getByNip);

exports.findAll = (req, res, next) => {
  Invoice.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices.",
      });
    else {
      console.log(data);
      res.send(data);
    }
  });
};

exports.getMaxId = (req, res) => {
  Invoice.getMaxId((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices.",
      });
    else {
      console.log(data);
      res.send(data);
    }
  });
};

exports.findAllVue = (req, res, next) => {
  Invoice.getAllVue((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices.",
      });
    } else {
      res.send(data);
    }
  });
};

exports.getInvoicesIntegrate = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Values can not be empty!",
    });
  }
  Invoice.integrationInvoices(
    req.body.nip,
    req.body.date_from,
    req.body.date_to,
    (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving invoices.",
        });
      } else {
        res.send(data);
      }
    }
  );
};

exports.findOne = (req, res) => {
  Invoice.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Invoice not found") {
        res.status(404).send({
          message: `Not found Invoice with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Invoice with id: " + req.params.id,
        });
      }
    } else res.status(200).send(data);
  });
};

//method using json with invoice date, customer, products,
//adding invoice_position, invoice, products
// czy przy wprowadzaniu produktow w jsonie maja one przy okazji byc wprowadzane do naszej
// bazy, jesli nie sa utworzone? Pobieramy z api liste produktów, nastepnie wrzucamy je do naszej bazy
exports.add = async function (req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Values can not be empty!",
    });
  }

  console.log("list of products: ", req.body.product);
  const productArr = req.body.product; //array of products retrieved from json
  const customerArr = req.body.customer;
  let productList = [];
  let n = 0;
  for (let product of productArr) {
    //iterate through products
    console.log("petla nr: ", n);
    n++;

    //check if product's vat exists in vat table, if not add new
    let checkedVatId = null;
    try {
      checkedVatId = await checkNumberPromisified(product.vat);
      //vat not found, create new vat and assign product with this vat_id
      console.log("not found");

      //create vat

      console.log("result vat: ", checkedVatId);
    } catch (err) {
      console.error(err);
      let data = await createVat(product.vat);
      console.log("id: ", data.id);
      checkedVatId = data.id;
    }

    // check if product exists
    try {
      let id = await checkIfProductExists(product);
      console.log("result product: ", id);

      console.log("product found");

      let productJSON = {
        product_id: id,
        vat_id: checkedVatId,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      };

      //store product list and their quantity to use later in sql query
      productList.push(productJSON);
      console.log(productList);
      // finish this iteration

      //vat not found, create new vat and assign product with this vat_id
    } catch (err) {
      //create product obj
      const productObj = new Product({
        vat_id: checkedVatId,
        name: product.name,
        price: product.price,
      });

      //add new product to db
      let data = await createProduct(productObj);
      console.log("id of added product: ", data.id);
      console.log(err);

      let productJSON = {
        product_id: data.id,
        vat_id: checkedVatId,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      };

      productList.push(productJSON);
      console.log(productList);
    }
  }

  let customerObj = null;
  //creating customer
  try {
    console.log("customer nip: ", customerArr.nip);
    customerObj = await checkIfCustomerExists(customerArr.nip);
    console.log("result customer: ", customerObj);
    customerId = customerObj.id;
  } catch (err) {
    console.error("error customer: ", err);
    console.log("customer not found");

    const customer = new Customer({
      first_name: customerArr.first_name,
      last_name: customerArr.last_name,
      email: customerArr.email,
      address: customerArr.address,
      brand_name: customerArr.brand_name,
      nip: customerArr.nip,
    });
    console.log(customerArr.nip);

    console.log(customer);

    //create customer
    customerObj = await createCustomer(customer);
    customerId = customerObj.id;
  }

  //create invoice
  let total_cost = productList.reduce(function (prev, cur) {
    return prev + cur.price * cur.quantity;
  }, 0);

  const invoiceid = await checkMaxId();
  const nextInvoiceId = invoiceid.id + 1;
  var today = new Date();
  var yr = today.getFullYear().toString();
  const invoice_number = nextInvoiceId.toString() + "/" + yr;

  const invoice = new Invoice({
    invoice_number: String(invoice_number),
    customer_id: customerId,
    seller_id: 1,
    invoice_date: req.body.invoice_date,
    due_date: req.body.due_date,
    invoice_status_id: 1,
    total: total_cost,
  });

  const invoiceObj = await createInvoice(invoice);
  console.log("invoice Object after add: ", invoiceObj);
  //add positions to invoice
  for (let product of productList) {
    const invoice_position = new Invoice_position({
      invoice_id: invoiceObj.id,
      name: product.name,
      product_id: product.product_id,
      quantity: product.quantity,
      unit_price: product.price,
      total: product.quantity * product.price,
    });

    //adding invoice to db
    const invoicePosObj = await createInvoicePos(invoice_position);

    console.log(
      "invoice pos id: ",
      invoicePosObj.id,
      " with product: ",
      product.name,
      " added"
    );
  }

  res.status(200).send("Invoice successfully added");
};

exports.update = function (req, res) {
  Invoice.updateById(req.params.id, new Invoice(req.body), (err, data) => {
    if (err) {
      if (err.error === "Invoice not found") {
        res.status(404).send({
          message: `Not found Invoice with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Invoice with id: " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.updateStatus = function (req, res) {
  Invoice.updateStatusById(
    req.params.status_id,
    req.params.invoice_id,
    (err, data) => {
      if (err) {
        if (err.error === "Invoice not found") {
          res.status(404).send({
            message: `Not found Status with id: ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Invoice with id: " + req.params.id,
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
          message: `Not found Invoice with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Invoice with id: " + req.params.id,
        });
      }
    } else res.send({ message: `Invoice deleted successfully!` });
  });
};
