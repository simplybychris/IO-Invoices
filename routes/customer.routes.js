const express = require('express'),
  router = express.Router(),
  customerController = require('../controllers/customerController');

// get customer lists wczesniejszy sposob
// router.get('/', function(req, res) {
//   let sql = `SELECT * FROM customer`;
//   db.query(sql, function(err, data, fields) {
//     if (err) throw err;
//     res.status(200).json(data);
//   })
// });

// localhost/customers/
// get customer lists
router.get('/', customerController.findAll);

// get customer by id
router.get('/:id', customerController.customer_detail);

// delete customer by id
// router.delete('/:id', customerController.customer_delete);

// update customer by id
// router.put('/:id', customerController.customer_update);

// create new user
router.post('/', customerController.customer_create_post);

module.exports = router;