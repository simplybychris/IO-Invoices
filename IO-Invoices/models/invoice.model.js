const sql = require("./dbconn.js");

const Invoice = function (invoice) {
  (this.invoice_number = invoice.invoice_number),
    (this.customer_id = invoice.customer_id),
    (this.seller_id = invoice.seller_id),
    (this.invoice_status_id = invoice.invoice_status_id),
    (this.invoice_date = invoice.invoice_date),
    (this.due_date = invoice.due_date),
    (this.total = invoice.total);
};

Invoice.getAll = (result) => {
  sql.query("SELECT * FROM invoice", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    console.log("invoices: ", res);
    result(null, res);
  });
};

Invoice.getAllVue = (result) => {
  sql.query(
    "SELECT invoice.id, first_name, last_name, invoice_date, due_date, total, invoice_status_id FROM invoice INNER JOIN customer ON customer.id = invoice.customer_id",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Invoice_position not found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

Invoice.integrationInvoices = function (nip, date, due_date, result) {
  sql.query(
    `SELECT invoice.id, invoice.invoice_number, nip, invoice_status.name as 'invoice_status', invoice_date, due_date, total FROM invoice INNER JOIN customer ON customer.id = invoice.customer_id INNER JOIN invoice_status ON  invoice_status.id = invoice.invoice_status_id WHERE nip='${nip}' AND invoice_date >= '${date}' AND due_date <= '${due_date}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Invoice_position not found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

Invoice.getMaxId = function (result) {
  sql.query("SELECT MAX(id) AS id FROM invoice", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({ error: "Invoice not found" }, null);
      return;
    }

    console.log("invoice: ", res);
    res[0];
    result(null, { ...res[0] });
  });
};

Invoice.getById = function (id, result) {
  sql.query("SELECT * FROM invoice where id = ?", id, function (err, res) {
    sql.query(
      "SELECT * FROM invoice_position WHERE invoice_id='" + id + "'",
      function (err, res2) {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.length <= 0) {
          result({ error: "Invoice not found" }, null);
          return;
        }

        console.log("invoice: ", res);
        res[0].products;
        result(null, { ...res[0], products: res2 });
      }
    );
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
  sql.query(
    "UPDATE invoice SET customer_id=?, seller_id=?, invoice_date=?, due_date=?, invoice_status_id=?, total=? WHERE id=?",
    [
      invoice.customer_id,
      invoice.seller_id,
      invoice.invoice_date,
      invoice.due_date,
      invoice.invoice_status_id,
      invoice.total,
      id,
    ],
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
    }
  );
};

Invoice.updateStatusById = (status_id, invoice_id, result) => {
  sql.query(
    "UPDATE invoice SET invoice_status_id=? WHERE id=?",
    [status_id, invoice_id],
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

      console.log("updated invoice: ", { id: invoice_id });
      result(null, {
        message: "Status successfully updated",
        id: invoice_id,
        status_id: status_id,
      });
    }
  );
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
