var express = require('express'),
    bcrypt = require('bcrypt');
var router = express.Router();
var db = require('../models');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/new');
 });

router.post('/login', (req, res) => {
   db.User.findOne({
      where:{
         email: req.body.email
      }
   }).then((userInDb) => {
      bcrypt.compare(req.body.password, userInDb.passwordDigest, (error, result) => {
          if(result){
            req.session.user = userInDb;
            res.redirect('/challenges');
         } else {
            res.redirect('/login');
         }
      });
   }).catch((error) => {
     console.log(error);
      res.redirect('/');
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
    res.redirect('/login');
  });
});


module.exports = router;