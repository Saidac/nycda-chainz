const express = require('express'),
      pug     = require('pug'),
      morgan = require('morgan'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      displayRoutes = require('express-routemap'),
      pg = require('pg'),
      moment = require('moment'),
      _ = require('lodash'),
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
  if (!req.session.user) {
    return res.redirect('/login');
  }

  db.Task.findAll({
      where:{
        UserId : req.session.user.id
      }
    }).then((tasks) => {
      var dataStructure = [];

      tasks.forEach((task, index) => {
        task.getChallenge().then((challenge) => {
          dataStructure.push(Object.assign({}, challenge.dataValues, {
            task: task.dataValues,
            user: req.session.user
          }));

          if (index === tasks.length - 1) {
            console.log(dataStructure);
            res.render('challenges/index', { challenges: dataStructure });
          }
        });
      });
    });
  });
  // }).catch((error) => {
  //   res.status(404).end();
  // });



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
    uuid: base64url(crypto.randomBytes(48)),
    pot: req.body.challenge.pot

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

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
    res.redirect('/wait');
  }).catch((error) => {
    res.redirect('/challenges/new');
  });
});
});

app.get('/chainz', (req, res) => {
  res.render('chainz/index');
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
    db.User.create({
      password: req.body.participant.password
    });
  }).then((participant) => {
    res.redirect('/challenges');
  }).catch((error) => {
    console.log(error);
  });
});

app.get('/:uuid', (req, res) => {
  var startOfTheChallenge, foundChallenge, foundTasks, participant,
      userTask, participantTask,
      participantCheckers = [],
      userCheckers = [];

  if (!req.session.user) {
    res.redirect('/login');
  }

  db.Challenge.findOne({
     where:{
      uuid: req.params.uuid
     }
  }).then((challenge) => {
    foundChallenge = challenge;
    startOfTheChallenge = moment(foundChallenge.createdAt);

    return challenge.getTasks();
  }).then((tasks) => {
    _.times(foundChallenge.numberOfDays, (n) => {
      participantCheckers.push({
        checked: false,
        current: startOfTheChallenge.day === moment().day,
        day: startOfTheChallenge.add(n, 'days')
      });
      userCheckers.push({
        checked: false,
        current: startOfTheChallenge.day === moment().day,
        day: startOfTheChallenge.add(n, 'days')
      });
    });

    userTask = tasks.find((task) => task.UserId === req.session.user.id);
    participantTask = tasks.find((task) => task.UserId !== req.session.user.id);

    return participantTask.getUser();
  }).then((participant) => {

    if (!foundChallenge.active) {
      return res.render('tasks/new', { challenge: foundChallenge, participant: participant });
    }

    return db.Checker.findAll({ where: { TaskId: userTask.id }});
  }).then((checkers) => {
    console.log('AFTER CHECKER');
    checkers.forEach((checker, index) => {
      userCheckers[index].checked = true;
    });

    return db.Checker.findAll({ where: { TaskId: participantTask.id }});
  }).then((checkers) => {
    checkers.forEach((checker, index) => {
      participantCheckers[index].checked = true;
    });

    var dataStructure = {
      name: foundChallenge.name,
      pot: foundChallenge.pot,
      user: req.session.user,
      participant: participant,
      userTask: userTask,
      participantTask: participantTask,
      userCheckers: userCheckers,
      participantCheckers: participantCheckers
    };

    console.log(dataStructure);
    
    res.render('challenges/show', { dataStructure: dataStructure });
  });
});


app.post('/challenges/:id', (req, res) => {
  db.User.update({
    password: req.body.participant.password,
    name: req.body.participant.name
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
    console.log(error);
  });
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
