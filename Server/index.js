const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../Database/index');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});

// Get all questions for product
app.get('/api/qa/questions', (req, res) => {
  db.getAllQuestionsForProductId(req.body.productId, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send({
        product_id: req.body.productId,
        results: results.rows
      });
    }
  });
});

// Get all answers for question that aren't reported
app.get('/api/qa/questions/:question_id/answers', (req, res) => {
  const questionId = req.params.question_id;
  db.getQuestionAnswers(questionId, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send({
        question: questionId,
        page: results.page,
        count: results.count,
        results: results.rows
      });
    }
  });
});

// Add a question for product
app.post('/api/qa/questions', (req, res) => {
  db.addAQuestion(req.body, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).send(results);
    }
  });
});

// Add a answer to a given question
app.post('/api/qa/questions/:question_id/answers', (req, res) => {
  db.addAnAnswer(req.body, req.params.question_id, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).send(results);
    }
  });
});

// Mark a question as helpful
app.put('/api/qa/questions/:question_id/helpful', (req, res) => {
  db.markQuestionAsHelpful(req.params.question_id, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(204).send(results);
    }
  });
});

// Mark a answer as helpful
app.put('/api/qa/answers/:answer_id/helpful', (req, res) => {
  db.markAnswerAsHelpful(req.params.answer_id, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(204).send(results);
    }
  });
});

// Report a question
app.put('/api/qa/questions/:question_id/report', (req, res) => {
  db.reportQuestion(req.params.question_id, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(204).send(results);
    }
  });
});

// Report a answer
app.put('/api/qa/answers/:answer_id/report', (req, res) => {
  db.reportAnswer(req.params.answer_id, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(204).send(results);
    }
  });
});
