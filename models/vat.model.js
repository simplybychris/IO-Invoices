const sql = require("./dbconn.js");

const Vat = function (vat) {
  this.number = vat.number
};

Vat.getAll = result => {
  sql.query("SELECT * FROM vat", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Vat: ", res);
    result(null, res);
  });
};

Vat.getById = function (id, result) {
  sql.query("SELECT * FROM vat where id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({ error: `Vat with number: ${req.body.number} not found` }, null);
      return;
    }

    console.log("Found vat: ", res[0]);
    result(null, res[0]);


    console.log("vat: ", res);
    result(null, res);
  });
};

Vat.checkNumber = function (number, result) {
  sql.query("SELECT * FROM vat where number = ?", number, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length <= 0) {
      err = "Vat cannot be null";
      result({ error: "Vat not found" }, null);
      return;
    }

    console.log("Found vat: ", res[0].id);
    result(null, res[0].id);
    return;
  });
};

Vat.create = (newVat, result) => {
  sql.query("INSERT INTO vat (number) VALUES ("+newVat+")", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created vat: ", { id: res.insertId });
    result(null, { id: res.insertId, ...newVat });
  });
};

Vat.updateById = (id, vat, result) => {
  sql.query("UPDATE vat SET number=? WHERE id=?",
    [vat.number, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Vat not found" }, null);
        return;
      }

      console.log("updated vat: ", { id: id, ...vat });
      result(null, { id: id, ...vat });
    });
};

Vat.delete = (id, result) => {
  sql.query("DELETE FROM vat WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted vat with id: ", id);
    result(null, res);
  });
};

module.exports = Vat;