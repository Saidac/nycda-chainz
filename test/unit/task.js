var assert = require('assert');
var db = require('./../models');

describe('Task Model', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });
  it('can create a task', (done) => {
    db.Task.create({
      name: 'learning spanish'
    }).then((task) => {
      assert.equal(task.name, 'learning spanish');
       done();
    });
  });
  it('can update a task', (done) => {

  });
  it('ChallengeId refers to id of challenge', (done) => {

  });
  it('UserId refers to id of user', (done) => {

  });

});
