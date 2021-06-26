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
      res.status(200).send(results);
    }
  });
});

// Get all answers for question
app.get('/api/qa/questions/:question_id/answers', (req, res) => {
  db.getQuestionAnswers(req.params.question_id, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

// Add a question for product
app.post('/api/qa/questions', (req, res) => {
  db.addAQuestion(req.body, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});
