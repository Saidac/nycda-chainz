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

app.post('/checkers', (req, res) => {
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
  if (!req.session.user) {
    res.redirect('/login');
  }

  db.Challenge.findOne({
     where:{
      uuid: req.params.uuid
     }
  }).then((challenge) => {
    challenge.getUsers().then((users) => {
      // most complicated part of the app:
      if (!challenge.active) {
        var participant = users.filter((user) => {
          return !user.passwordDigest;
        })[0];

       return res.render('tasks/new', { challenge: challenge, participant: participant });
      }

      challenge.getTasks().then((tasks) => {
        // marshall/design your object here
        var dataStructure = {
          name: challenge.name,
          tasks: tasks.map((task) => {
            var owner = users.filter((user) => {
              return user.id === task.UserId;
            })[0];

            return Object.assign({}, task.dataValues, { owner: owner.dataValues });
          })
        };
        res.render('challenges/show', { dataStructure: dataStructure });
      });
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
