const sql = require("./dbconn.js");

const Seller = function (seller) {
  this.first_name = seller.first_name,
    this.last_name = seller.last_name,
    this.email = seller.email,
    this.address = seller.address,
    this.brand_name = seller.brand_name,
    this.nip = seller.nip
};

Seller.getAll = result => {
  sql.query("SELECT * FROM seller", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    console.log("sellers: ", res);
    result(null, res);
  });
};

Seller.getById = function (id, result) {
  sql.query("SELECT * FROM seller where id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({error: "Seller not found"}, null);
      return;
    }

    console.log("Found seller: ", res[0]);
    result(null, res[0]);


    console.log("seller: ", res);
    result(null, res);
  });
};

Seller.create = (newSeller, result) => {
  sql.query("INSERT INTO seller SET ?", newSeller, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created seller: ", { id: res.insertId });
    result(null, { id: res.insertId, ...newSeller });
  });
};

Seller.updateById = (id, seller, result) => {
  sql.query("UPDATE seller SET first_name=?, last_name=?, email=?, address=?, brand_name=?, nip=? WHERE id=?",
    [seller.first_name, seller.last_name, seller.email, seller.address, seller.brand_name, seller.nip, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Seller not found" }, null);
        return;
      }

      console.log("updated seller: ", { id: id, ...seller });
      result(null, { id: id, ...seller });
    });
};

Seller.delete = (id, result) => {
  sql.query("DELETE FROM seller WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted seller with id: ", id);
    result(null, res);
  });
};

module.exports = Seller;