const express = require('express'),
      logger = require('morgan'),
      odyParser = require('body-parser'),
      morgan = require('morgan'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var db = require('./models');

var app = express();

app.use(logger('dev'));

app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => {
  console.log(request.session);
  db.Entry.findAll({ order: [['createdAt', 'DESC']] }).then((entries) => {
    response.render('index', { entries: entries, user:request.session.user });
  });
});


app.listen(3000, () => {
  console.log('Web server is running on port 3000');
});
