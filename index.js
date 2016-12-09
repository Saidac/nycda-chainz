const express = require('express'),
      pug     = require('pug'),
      morgan = require('morgan'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      displayRoutes = require('express-routemap'),
      pg = require('pg'),
      session = require('express-session'),
      crypto = require('crypto'),
      base64url = require('base64url');

var app = express(),
    db = require('./models'),
    transporter = nodemailer.createTransport(
     'smtps://nycdaamswdi%40gmail.com:' +
     process.env.EMAIL_PASSWORD_Blog_App +'@smtp.gmail.com'),
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
  if (req.session.user) {
    return res.redirect('/challenges/new');
  }

  res.render('users/new');
});

app.get('/challenges', (req, res) => {
  db.Challenge.findAll().then((challenges) => {
      res.render('challenges/index', { challenges: challenges });
  });
});

app.get('/challenges/new', (req, res) => {
  if (req.session.user) {
    res.render('challenges/new');
  } else {
    res.redirect('/');
  }
});

app.get('/wait', (req, res) => {
  res.render('challenges/wait');
});
//

// app.post('/challenges', (req, res) => {
//   console.log("challenges route triggerd");
//   var challengeParams = {
//     name: req.body.challenge.name,
//     numberOfDays: req.body.challenge.numberOfDays,
//     uuid: base64url(crypto.randomBytes(48))
//   };
//
//   db.Challenge.create(challengeParams).then((challenge) => {
//    // we should wrap all these in a transaction:
//    db.Task.create({
//      name: req.body.task.name,
//      UserId: req.session.user.id,
//      ChallengeId:  challenge.id
//    }).then((task) => {
//      return db.User.create({
//        email: req.body.participant.email
//      });
//    }).then((participant) => {
//   console.log("email participant is");
//   console.log(participant.email);
//     return  db.Task.create({
//        UserId: participant.id,
//        ChallengeId: challenge.id
//      });
//    }).then((anotherTask) => {
//      console.log("send email to participant");
//      console.log("email participant is 222");
//      console.log(participant.email);
//      var mailOptions = {
//        to: participant.email,
//        subject: 'Invitation to challenge',
//        text: ` Hello,
//          You has been invited to do a challenge, Please click this below link to see the details
//           http://localhost:3000/${challenge.uuid}`
//      };
//      console.log("send email to ffffffparticipant");
//      transporter.sendMail(mailOptions, (error, info) => {
//        if (error){
//
//          return console.log(error);
//        }
//
//        console.log('Message sent: ' + info.response);
//      });
//    }).catch((error) => {
//      console.log('error will be: ');
//      console.log(error);
//      // do something when any of the operations fail
//    });
//   });
//    res.redirect('/wait');
//   });

  app.post('/challenges', (req, res) => {
    var savedChallenge;
    var challengeParams = {
      name: req.body.challenge.name,
      numberOfDays: req.body.challenge.numberOfDays,
      uuid: base64url(crypto.randomBytes(48))
    };

    db.sequelize.transaction(function(t) {
      return db.Challenge.create(challengeParams, { transaction: t }).then((challenge) => {
        savedChallenge = challenge;

        return db.Task.create({
          name: req.body.task.name,
          UserId: req.session.user.id,
          ChallengeId:  challenge.id
        }, { transaction: t }).then(function(task) {
          return db.User.create({
            email: req.body.participant.email
          }, { transaction: t }).then((participant) => {
            return db.Task.create({
              UserId: participant.id,
              ChallengeId:  challenge.id
            },{ transaction: t });
          });
        });
      });
    }).then((participantTask) => {
      console.log('RESULT IS:');
      console.log(participantTask);
      var mailOptions = {
        to: req.body.participant.email,
        subject: 'Invitation to challenge',
        text: ` Hello,
          You has been invited to do a challenge, Please click this below link to see the details
          http://localhost:3000/${savedChallenge.uuid}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }

        console.log('Message sent: ' + info.response);
      });
      res.redirect('/wait');
    }).catch((error) => {
      console.log("error will be");
      console.log(error);
      res.redirect('/challenges/new');
      // do something when any of the operations fail
    });
  });


// return sequelize.transaction(function (t) {
//
//   // chain all your queries here. make sure you return them.
//   return User.create({
//     firstName: 'Abraham',
//     lastName: 'Lincoln'
//   }, {transaction: t}).then(function (user) {
//     return user.setShooter({
//       firstName: 'John',
//       lastName: 'Boothe'
//     }, {transaction: t});
//   });
//
// }).then(function (result) {
//   // Transaction has been committed
//   // result is whatever the result of the promise chain returned to the transaction callback
// }).catch(function (err) {
//   // Transaction has been rolled back
//   // err is whatever rejected the promise chain returned to the transaction callback
// });


app.post('/checkers', (req, res) => {
  console.log('posting checker');
  db.Checker.create(req.body).then((checker) => {
    res.redirect('/');
  });
});

app.post('/tasks/new', (req, res) => {
  db.Task.create({
    name: req.body.task.name
  }).then((task) => {
    return db.User.create({
      password: req.body.participant.password
    });
  }).then((participant) => {
    res.redirect('/challenges');
  }).catch((error) => {
    console.log(error);
  });
});

app.get('/:uuid', (req, res) => {
  db.Challenge.findOne({
     where:{
      uuid: req.params.uuid
     }
  }).then((challenge) => {
    console.log('challenge is :');
    console.log(challenge);
    challenge.getUsers().then((users) => {
      var participant = users.filter((user) => {
        return !user.passwordDigest;
      })[0];

      // most complicated part of the app:
      if (!challenge.active) {
        res.render('tasks/new', { challenge: challenge, participant: participant });
      } else {
        challenge.getTasks().then((tasks) => {
          res.render('challenges/show', {
            challenge: challenge,
            users: users,
            tasks: tasks
          });
        });
      }
    });
  });
});


app.post('/challenges/:id', (req, res) => {
  db.User.update({
    password: req.body.participant.password
  }, {
    where: {
      id: req.body.participant.id
    }
  }).then((participant) => {
    return db.Task.update({
      name: req.body.task.name
    }, {
      where: {
        UserId: req.body.participant.id,
        ChallengeId: req.body.challenge.id
      }
    });
  }).then((task) => {
    return db.Challenge.update({
      active: true
    }, {
      where: {
        id: req.params.id
      },
      returning: true
    });
  }).then((updateMetaData) => {
    var challenge = updateMetaData[1][0];
    console.log('challenge for post: ');
    console.log(challenge);
    res.redirect(`/${challenge.uuid}`);
  }).catch((error) => {
    console.log("the error is ");
    console.log(error);
    // one of the operations failed handle the problem here;
  });
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
