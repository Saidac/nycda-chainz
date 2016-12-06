const express = require('express'),
      pug     = require('pug'),
      morgan = require('morgan'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      displayRoutes = require('express-routemap'),
      pg = require('pg'),
      moment = require('moment'),
      session = require('express-session'),
      crypto = require('crypto'),
      base64url = require('base64url');

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

app.get('/index', (req, res) => {
   res.render('index');
});

app.get('/challenges', (req, res) => {
  db.Challenge.findAll().then((challenges) => {
      res.render('challenges/index', { challenges: challenges });
  });
});

app.get('/challenges/new', (req, res) => {
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
        challenge.uuid = base64url(crypto.randomBytes(48));
        challenge.save().then((challenge) => {
          var mailOptions = {
            to: participant.email,
            subject: 'Invitation to challenge',
            text: ` Hello,
              You has been invited to do a challenge, Please click this below link to see the details
               http://localhost:3000/${challenge.uuid}
               `
            };
          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                return console.log(error);
              }
              console.log('Message sent: ' + info.response);
            });
        });
      });
    });
    res.redirect('/wait');
  });

});


app.post('/checkers', (req, res) => {
  console.log('posting checker');
  db.Checker.create(req.body).then((checker) => {
    res.redirect('/');
  });
});
//
// app.get('/:uuid', (req, res) => {
//   db.Challenge.findOne({
//          where:{
//             uuid: req.params.uuid
//          }
//       }).then((challenge) => {
//         res.render('tasks/new', { challenge: challenge });
//       });
// });
app.post('/tasks/new', (req, res) => {
  db.Task.create({
    name: req.body.task.name
  }).then((task) => {
    db.User.create({
      password: req.body.participant.password
  }  ).then((participant) => {
      res.redirect('/challenges');
    }).catch((error) => {
      console.log(error);
    });

  });
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
