var assert = require('assert');
var db = require('./../models');

describe('User Model', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });
  it('can create a  user', (done) => {
    db.User.create({
      name: 'Zahra',
      surname: 'Fam',
      email: 'fam@gmail.com'

    }).then((user) => {
      assert.equal(user.name, 'Zahra');
      assert.equal(user.surname, 'Fam');
      assert.equal(user.email, 'fam@gmail.com');
       done();
    });
  });
  it('can update a user', (done) => {

  });
  it('can not create a user without email', (done) => {
    db.User.create({
      name: 'Yalda',
      surname: 'Seri'
    }).catch((error) => {
      assert.equal(error.errors[0].message, 'email cannot be null');
      assert.equal(error.errors.length, 1);
      done();
    });
    });

  });
  it('can not create a user with the existing email', (done) => {

  });
  it('ChallengeId refers to id of challenge', (done) => {

  });



});
