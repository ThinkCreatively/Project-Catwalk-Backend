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

module.exports = {
  getAllQuestionsUnderId10
};
