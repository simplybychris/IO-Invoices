const mysql = require('mysql'), // import mysql module
  dbConfig = require("../db.config.js")
  cors = require('cors');


// setup database
db = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

db.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = db;

