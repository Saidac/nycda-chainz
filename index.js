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
  secret: 'keyboard cat'
}));

app.use('/', authenticationRoute);

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('users/new');
 });

app.get('/challenges', (req, res) => {
  db.Challenge.findAll().then((challenges) => {
      res.render('challenges/index', { challenges: challenges });
  });
});

app.get('/challenges/new', (req, res) => {
  console.log(req.session.user);
  res.render('challenges/new');
});
app.get('/wait', (req, res) => {
  res.render('challenges/wait');
});

app.post('/challenges', (req, res) => {
  db.Challenge.create(req.body.challenge).then((challenge) => {
    db.Task.create({
      name: req.body.task.name,
      UserId: req.session.user.id,
      ChallengeId:  challenge.id
    }).then((task) => {
      db.User.create({
        email: req.body.participant.email
      }).then((participant) => {
        console.log('patricipant is');
        console.log(participant);
        // instead send this email for now:
        // you've been challenged by user.email
        var mailOptions = {
          from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
          to: participant.email, // list of receivers
          subject: 'Hello ', // Subject line
          text: 'Hello world 🐴', // plaintext body
          html: '<b>Hello world 🐴</b>' // html body
          };

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
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
