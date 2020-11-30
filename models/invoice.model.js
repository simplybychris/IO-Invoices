const sql = require("./dbconn.js");

const Invoice = function (invoice) {
    this.customer_id = invoice.customer_id,
    this.seller_id = invoice.seller_id,
    this.invoice_position_id = invoice.invoice_position_id,
    this.invoice_date = invoice.invoice_date,
    this.due_date = invoice.due_date,
    this.invoice_status_id = invoice.invoice_status_id,
    this.total = invoice.total
};

Invoice.getAll = result => {
  sql.query("SELECT * FROM invoice", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    console.log("invoices: ", res);
    result(null, res);
  });
};

Invoice.getById = function (id, result) {
  sql.query("SELECT * FROM invoice where id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({error: "Invoice not found"}, null);
      return;
    }

    console.log("Found invoice: ", res[0]);
    result(null, res[0]);


    console.log("invoice: ", res);
    result(null, res);
  });
};

Invoice.create = (newInvoice, result) => {
  sql.query("INSERT INTO invoice SET ?", newInvoice, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created invoice: ", { id: res.insertId });
    result(null, { id: res.insertId, ...newInvoice });
  });
};

Invoice.updateById = (id, invoice, result) => {
  sql.query("UPDATE invoice SET customer_id=?, seller_id=?, invoice_position_id=?, invoice_date=?, due_date=?, invoice_status_id=?, total=? WHERE id=?",
    [invoice.customer_id, invoice.seller_id, invoice.invoice_position_id, invoice.invoice_date, invoice.due_date, invoice.invoice_status_id, invoice.total, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Invoice not found" }, null);
        return;
      }

      console.log("updated invoice: ", { id: id, ...invoice });
      result(null, { id: id, ...invoice });
    });
};

Invoice.delete = (id, result) => {
  sql.query("DELETE FROM invoice WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted invoice with id: ", id);
    result(null, res);
  });
};

module.exports = Invoice;