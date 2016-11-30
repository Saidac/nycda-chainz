var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/new');
 });

router.post('/login', (req, res) => {
  console.log(req.body);
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((userInDB) => {
        req.session.user = userInDB;
        res.redirect('/challenges');

    }).catch(() => {
    res.redirect('/login');
  });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

router.post('/users', (req, res) => {
  var user = req.body;
  db.User.create(user).then((user) => {
    req.session.user = user; // we are log the user in
    res.redirect('/');
  });
});


module.exports = router;
