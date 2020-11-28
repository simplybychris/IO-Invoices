const express = require('express'),
      app = express(),
      cors = require('cors'),
      bodyParser = require('body-parser');

require('mysql');
require('dotenv').config();

//https://www.youtube.com/watch?v=dDjzTDN3cy8&t=4184s&ab_channel=HamzaMirza

// run modules
// app.use(cors());
app.use(express.urlencoded({extended: true})); 
app.use(express.json());   

// routers
const customersRouter = require('./routes/customer.routes');
const productsRouter = require('./routes/product.routes');

// use router
app.use('/customers', customersRouter);
app.use('/products', productsRouter);



const port = process.env.PORT || 4040;
app.listen( port, () => console.log(`Server started, listening port: ${port}`));