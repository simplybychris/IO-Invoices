const express = require("express"),
  app = express(),
  cors = require("cors"),
  bodyParser = require("body-parser");

require("mysql");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

// app.options((req,res,next)=>{
// res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Methods", "*");
// res.header("Access-Control-Allow-Headers", "*");
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();
// })

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
// routers
const customersRouter = require("./routes/customer.routes");
const sellerRouter = require("./routes/seller.routes");
const invoicesRouter = require("./routes/invoice.routes");
const productsRouter = require("./routes/product.routes");
const vatRouter = require("./routes/vat.routes");
const invoice_positionsRouter = require("./routes/invoice_position.routes");
const invoice_statusesRouter = require("./routes/invoice_status.routes");

// use router
app.use("/customers", customersRouter);
app.use("/sellers", sellerRouter);
app.use("/invoices", invoicesRouter);
app.use("/products", productsRouter);
app.use("/vats", vatRouter);
app.use("/invoice_positions", invoice_positionsRouter);
app.use("/invoice_statuses", invoice_statusesRouter);

const port = process.env.PORT || 4040;
app.listen(port, () => console.log(`Server started, listening port: ${port}`));
