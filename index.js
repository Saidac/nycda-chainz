const express = require('express'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var db = require('./models');

var app = express();

app.use(logger('dev'));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log('rendering index');
  res.render('index');
});

app.post('/challenges', (req, res) => {
  console.log('creating challenge');
  db.Challenge.create(req.body).then((challenge) => {
    res.redirect('/');
  });
});

app.post('/checkers', (req, res) => {
  console.log('posting checker');
  db.Checker.create(req.body).then((checker) => {
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Web server is running on port 3000');
});
