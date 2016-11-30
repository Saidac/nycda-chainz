const express = require('express'),
      pug     = require('pug'),
      morgan = require('morgan'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      displayRoutes = require('express-routemap'),
      pg = require('pg'),
      session = require('express-session');

var app = express(),
    db = require('./models'),
    transporter = nodemailer.createTransport(
     'smtps://nycdaamswdi%40gmail.com:'+
     process.env.EMAIL_PASSWORD_Blog_App+'@smtp.gmail.com'),
     authenticationRoute = require('./routes/authentication');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use('/', authenticationRoute);

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('users/new');
 });
app.get('/challenges', (req, res) => {
  db.Challenge.findAll().then((challenges) => {
      res.render('challenges/index', {challenges: challenges});
  });
});

app.get('/challenges/new', (req, res) => {
  res.render('challenges/new');
});

app.post('/challenges/new', (req, res) => {
  res.redirect('/challenges/new');
});

app.post('/challenges', (req, res) => {
  db.Challenge.create(req.body.challenge).then((challenge) => {
    db.Task.create({
      name: req.body.task.name,
      userId: req.session.user.id, // change this to req.session.user.id for the right logic
      challengeId: req.body.challenge.id
    }).then((task) => {
      db.User.create({
        email: req.body.participant.email
      }).then((participant) => {
        console.log(participant);
        // instead send this email for now:
        // you've been challenged by user.email
      });
    });
    res.redirect('/challenges');
  });

});

app.post('/checkers', (req, res) => {
  console.log('posting checker');
  db.Checker.create(req.body).then((checker) => {
    res.redirect('/');
  });
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
