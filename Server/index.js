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

// Get all questions
app.get('/api/qa/questions', (req, res) => {
  db.getAllQuestionsUnderId10((err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

// Add a question
app.post('/api/qa/questions', (req, res) => {
  db.addAQuestion(req.body, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});
