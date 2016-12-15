var express = require('express'),
    bcrypt = require('bcrypt');
var router = express.Router();
var db = require('../models');

router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  res.render('users/login');
});

router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  res.render('users/new');
});

router.post('/login', (req, res) => {
   db.User.findOne({
      where:{
         email: req.body.email
      }
   }).then((userInDb) => {
      bcrypt.compare(req.body.password, userInDb.passwordDigest, (error, result) => {
        if (result) {
          req.session.user = userInDb;
          req.app.locals.user = userInDb;
          res.redirect('/challenges');
        } else {
         res.render('users/login', { error: { message: 'Password is incorrect' } });
        }
      });
  }).catch((error) => {
    res.render('users/login', { error: { message: 'User not found in the database' } });
  });
});


router.get('/logout', (req, res) => {
  req.session.user = undefined;
  req.app.locals.user = undefined;
  res.redirect('/');
});

router.post('/users', (req, res) => {
  var user = req.body;
  db.User.create(user).then((user) => {
    req.session.user = user; // we are log the user in
    res.redirect('/');
  }).catch((error) => {
    console.log(error);
    res.render('users/new', { errors: error.errors });
  });
});


module.exports = router;
