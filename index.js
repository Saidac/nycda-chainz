const express = require('express'),
      pug     = require('pug'),
      morgan = require('morgan'),
      sequelize = require('sequelize'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      displayRoutes = require('express-routemap'),
       pg = require('pg'),
       bcrypt = require('bcrypt'),
       session = require('express-session');

var app = express(),
    db = require('./models'),
    transporter = nodemailer.createTransport(
     'smtps://nycdaamswdi%40gmail.com:'+
     process.env.EMAIL_PASSWORD_Blog_App+'@smtp.gmail.com');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.set('view engine', 'pug');

 app.get('/', (req, res) => {
    res.render('users/new');
 });
app.get('/login', (req, res) => {
  res.redirect('/');
});
// app.get('/', (req, res) => {
//   res.render('users/login');
// });
app.get('/challenges', (req, res) => {
  db.Challenge.findAll().then((challenges) => {
      res.render('challenges/new', {challenges: challenges});
  });
});
app.post('/users', (req, res) => {
  var user = req.body;
  db.User.create(user).then((user) => {
      res.redirect('/');
  });
});
app.post('/login', (req, res) => {

});
app.post('/challenges/new', (req, res) => {
  res.redirect('/challenges/new');
});
app.post('/challenges', (req, res) => {
   challenge= req.body ;
  db.Challenge.create(challenge).then((challenge) => {
    res.redirect('/challenges');
  });
//   db.Challenge.create(req.body.challenge).then((challenge) => {
//
//     // db.Task.create({
//     //   name: req.body.task.name,
//     //   userId: currentUser.id,
//     //   challengeId: challenge.id
//     // }).then((task) => {
//     //   db.User.create({
//     //     email: req.body.participant.email
//     //   }).then((participant) => {
//     //     // instead send this email for now:
//     //     // you've been challenged by user.email
//     //   });
//     // });
//   });
});
db.sequelize.sync().then(() => {
  app.listen(3000, () => {
      console.log('Web Server is running on port 3000');
       displayRoutes(app);
    });
  });
