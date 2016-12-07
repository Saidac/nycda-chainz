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

app.get('/chainz', (req, res) => {
   res.render('chainz/index');
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

app.post('/challenges', (req, res) => {
  var challengeParams = {
    name: req.body.challenge.name,
    numberOfDays: req.body.challenge.numberOfDays,
    uuid: base64url(crypto.randomBytes(48))
  };

  db.Challenge.create(challengeParams).then((challenge) => {
    // we should wrap all these in a transaction:
    db.Task.create({
      name: req.body.task.name,
      UserId: req.session.user.id,
      ChallengeId:  challenge.id
    }).then((task) => {
      return db.User.create({
        email: req.body.participant.email
      });
    }).then((participant) => {
      return db.Task.create({
        UserId: participant.id,
        ChallengeId:  challenge.id
      });
    }).then((anotherTask) => {
      var mailOptions = {
        to: participant.email,
        subject: 'Invitation to challenge',
        text: ` Hello,
          You has been invited to do a challenge, Please click this below link to see the details
           http://localhost:3000/${challenge.uuid}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error){
          return console.log(error);
        }

        console.log('Message sent: ' + info.response);
      });
    }).catch((error) => {
      // do something when any of the operations fail
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



app.get('/:uuid', (req, res) => {
  db.Challenge.findOne({
     where:{
      uuid: req.params.uuid
     }
  }).then((challenge) => {
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
      }
    });
  }).then((challenge) => {
    res.redirect(`/${challenge.uuid}`);
  }).catch((error) => {
    console.log(error);
    // one of the operations failed handle the problem here;
  });

  // update task name
  // update user password
  // update challenge isactive to true


  // db.Challenge.update({
  //
  // })

  // db.Task.create({
  //   name: req.body.task.name
  // }).then((task) => {
  //   db.User.create({
  //     password: req.body.participant.password
  // }  ).then((participant) => {
  //     res.redirect('/challenges');
  //   }).catch((error) => {
  //     console.log(error);
  //   });

});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
