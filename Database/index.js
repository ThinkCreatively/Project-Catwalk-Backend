const { Pool } = require('pg');
const { connection } = require('./config');

const PORT = 5432;

const pool = new Pool(connection);

pool.connect((err) => {
  if (err) {
    console.log('err', err);
  } else {
    console.log(`Connected to postgreSQL on port: ${PORT}`);
  }
});

const getAllQuestionsForProductId = (productId, callback) => {
  pool.query(`SELECT * FROM questions WHERE productId = ${productId}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const addAQuestion = (params, callback) => {
  console.log(params)
  pool.query('INSERT INTO questions("productid", "body", "askername", "askeremail", "reported", "helpfullness") VALUES(1, \'this is test\', \'james\', \'email@email.com\', 0, 2)',
    [params.productId,
    params.body,
    params.askerName,
    params.askerEmail,
    params.reported,
    params.helpfullness
    ], (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
};

module.exports = {
  getAllQuestionsForProductId, addAQuestion
};
