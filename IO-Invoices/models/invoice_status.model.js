const sql = require("./dbconn.js");

const Invoice_status = function (invoice_status) {
    this.name = invoice_status.name
};

Invoice_status.getAll = result => {
  sql.query("SELECT * FROM invoice_status", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    console.log("invoice_statuss: ", res);
    result(null, res);
  });
};

Invoice_status.getById = function (id, result) {
  sql.query("SELECT * FROM invoice_status where id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({error: "Invoice_status not found"}, null);
      return;
    }

    console.log("Found invoice_status: ", res[0]);
    result(null, res[0]);


    console.log("invoice_status: ", res);
    result(null, res);
  });
};

Invoice_status.create = (newInvoice_status, result) => {
  sql.query("INSERT INTO invoice_status SET ?", newInvoice_status, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created invoice_status: ", { id: res.insertId });
    result(null, { id: res.insertId, ...newInvoice_status });
  });
};

Invoice_status.updateById = (id, invoice_status, result) => {
  sql.query("UPDATE invoice_status SET name=? WHERE id=?",
    [invoice_status.name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Invoice_status not found" }, null);
        return;
      }

      console.log("updated invoice_status: ", { id: id, ...invoice_status });
      result(null, { id: id, ...invoice_status });
    });
};

Invoice_status.delete = (id, result) => {
  sql.query("DELETE FROM invoice_status WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted invoice_status with id: ", id);
    result(null, res);
  });
};

module.exports = Invoice_status;