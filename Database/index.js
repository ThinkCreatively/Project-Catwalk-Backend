/* eslint-disable quotes */
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

// Get questions for a product
const getAllQuestionsForProductId = (productId, callback) => {
  pool.query(`SELECT
  questions.questionId,
  questions.body,
  questions.date,
  questions.askerName,
  questions.helpfullness,
  questions.reported,
  COALESCE (jsonb_object_agg(answers.answerId, jsonb_build_object(
  'id', answers.answerId,
  'body',answers.body,
  'date',answers.date,
  'answerName',answers.answerName,
  'helpfulness',answers.helpfulness,
  'photos', answers.photos))
  FILTER (WHERE answers.answerId IS NOT NULL), '{}') AS answers
  FROM questions LEFT JOIN answers ON (questions.questionId = answers.questionId)
  WHERE questions.productId = ${productId}
  AND questions.reported = false
  GROUP BY questions.questionId LIMIT 5;`, (err, results) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Get all answers for a question that arent reported
let currentQuestionId;
let page = 1;
let count = 5;
const getQuestionAnswers = (questionId, callback) => {
  if (currentQuestionId === undefined) {
    currentQuestionId = questionId;
  } else if (currentQuestionId === questionId) {
    page += 1;
    count += 5;
  } else {
    currentQuestionId = questionId;
    page = 1;
    count = 5;
  }
  if (count > 5) {
    pool.query(`SELECT * FROM answers WHERE questionID = ${questionId} AND reported = false OFFSET ${count}`, (err, results) => {
      results.page = page;
      results.count = count;
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  } else {
    pool.query(`SELECT * FROM answers WHERE questionID = ${questionId} AND reported = false`, (err, results) => {
      results.page = page;
      results.count = count;
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }
};

// Add a question to a product
const addAQuestion = (params, callback) => {
  pool.query('INSERT INTO questions("productid", "body", "askername", "askeremail", "reported", "helpfullness") VALUES($1, $2, $3, $4, $5, $6)',
    [
      params.productId,
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

// Add a answer to a given question
const addAnAnswer = (params, questionID, callback) => {
  pool.query('INSERT INTO answers("questionid", "body", "answername", "answeremail", "reported", "helpfulness", "photos") VALUES($1, $2, $3, $4, $5, $6, $7)',
    [
      questionID,
      params.body,
      params.askerName,
      params.askerEmail,
      params.reported,
      params.helpfulness,
      params.photos
    ], (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
};

// Mark a question as helpful
const markQuestionAsHelpful = (questionID, callback) => {
  pool.query(`UPDATE questions SET helpfullness = helpfullness + 1 WHERE questionId = ${questionID}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Report a question
const reportQuestion = (questionID, callback) => {
  pool.query(`UPDATE questions SET reported = reported + 1 WHERE questionId = ${questionID}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Mark an answer as helpful
const markAnswerAsHelpful = (answerID, callback) => {
  pool.query(`UPDATE answers SET helpfulness = helpfulness + 1 WHERE answerId = ${answerID}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Report a answer
const reportAnswer = (answerID, callback) => {
  pool.query(`UPDATE answers SET reported = reported + 1 WHERE answerId = ${answerID}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  getAllQuestionsForProductId,
  addAQuestion,
  getQuestionAnswers,
  addAnAnswer,
  markQuestionAsHelpful,
  reportQuestion,
  markAnswerAsHelpful,
  reportAnswer
};
