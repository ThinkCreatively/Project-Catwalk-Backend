/* eslint-disable quotes */
const { Pool } = require('pg');
const { connection } = require('./config');

const pool = new Pool(connection);

pool.connect((err) => {
  if (err) {
    console.log('err', err);
  } else {
    console.log(`Connected to postgreSQL on port: ${connection.port}`);
  }
});

// Get questions for a product
const getAllQuestionsForProductId = (productId, callback) => {
  pool.query(`SELECT * FROM questions WHERE productId = ${productId}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Add a question to a product
const addAQuestion = (params, callback) => {
  pool.query('INSERT INTO questions("productid", "body", "askername", "askeremail", "reported", "helpfullness") VALUES($1, $2, $3, $4, $5, $6)',
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

// Get all answers for a question
const getQuestionAnswers = (questionId, callback) => {
  pool.query(`SELECT * FROM answers WHERE questionID = ${questionId}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  getAllQuestionsForProductId, addAQuestion, getQuestionAnswers
};
