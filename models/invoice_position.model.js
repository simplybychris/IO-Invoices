const sql = require("./dbconn.js");

const Invoice_position = function (invoice_position) {
  this.name = invoice_position.name,
    this.product_id = invoice_position.product_id,
    this.quantity = invoice_position.quantity,
    this.netto = invoice_position.netto,
    this.total = invoice_position.total
};

Invoice_position.getAll = result => {
  sql.query("SELECT * FROM invoice_position", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    console.log("invoice_positions: ", res);
    result(null, res);
  });
};

Invoice_position.getById = function (id, result) {
  sql.query("SELECT * FROM invoice_position where id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({error: "Invoice_position not found"}, null);
      return;
    }

    console.log("Found invoice_position: ", res[0]);
    result(null, res[0]);


    console.log("invoice_position: ", res);
    result(null, res);
  });
};

Invoice_position.create = (newInvoice_position, result) => {
  sql.query("INSERT INTO invoice_position SET ?", newInvoice_position, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created invoice_position: ", { id: res.insertId });
    result(null, { id: res.insertId, ...newInvoice_position });
  });
};

Invoice_position.updateById = (id, invoice_position, result) => {
  sql.query("UPDATE invoice_position SET name=?, product_id=?, quantity=?, netto=?, total=? WHERE id=?",
    [invoice_position.name, invoice_position.product_id, invoice_position.quantity, invoice_position.netto, invoice_position.total, id],
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

      console.log("updated invoice_position: ", { id: id, ...invoice_position });
      result(null, { id: id, ...invoice_position });
    });
};

Invoice_position.delete = (id, result) => {
  sql.query("DELETE FROM invoice_position WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted invoice_position with id: ", id);
    result(null, res);
  });
};

module.exports = Invoice_position;