const sql = require("./dbconn.js");

const Product = function (product) {
  this.vat_id = product.vat_id,
  this.name = product.name,
  this.price = product.price
};

Product.getAll = result => {
  sql.query("SELECT * FROM product", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Products: ", res);
    result(null, res);
  });
};

Product.getById = function (id, result) {
  sql.query("SELECT * FROM product where id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({error: "Product not found"}, null);
      return;
    }

    console.log("Found product: ", res[0]);
    result(null, res[0]);


    console.log("product: ", res);
    result(null, res);
  });
};

Product.create = (newProduct, result) => {
  sql.query("INSERT INTO product SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created product: ", { id: res.insertId });
    result(null, { id: res.insertId, ...newProduct });
  });
};

Product.updateById = (id, product, result) => {
  sql.query("UPDATE product SET vat_id=?, name=?, price=? WHERE id=?",
    [product.vat_id, product.name, product.price, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Product not found" }, null);
        return;
      }

      console.log("updated product: ", { id: id, ...product });
      result(null, { id: id, ...product });
    });
};

Product.delete = (id, result) => {
  sql.query("DELETE FROM product WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted product with id: ", id);
    result(null, res);
  });
};

module.exports = Product;