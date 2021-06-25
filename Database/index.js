const { Pool } = require('pg');

const PORT = 5432;

const pool = new Pool({
  host: 'localhost',
  user: 'qauser',
  password: 'Xingbu99!',
  database: 'questionsandanswers',
  port: PORT
});

pool.connect((err) => {
  if (err) {
    console.log('err', err);
  } else {
    console.log(`Connected to postgreSQL on port: ${PORT}`);
  }
});

const getAllQuestionsUnderId10 = (callback) => {
  pool.query('SELECT * FROM questions WHERE questionId < 10', (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const addAQuestion = (params, callback) => {
  pool.query('INSERT INTO questions (productId, body, date, askerName, askerEmail, reported, helpfullness) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [params.productId,
      params.body,
      params.date,
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
  getAllQuestionsUnderId10, addAQuestion
};
