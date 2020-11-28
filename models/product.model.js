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

module.exports = Product;