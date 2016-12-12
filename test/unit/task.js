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
  
  it('can not create a task with a wrong  ChallengeId or without a ChallengeId ', (done) => {
    db.Task.create({
      name: 'a new one',
      ChallengeId: '4'

    }).then((task) => {
      task.getChallenge().then((challenge) => {
        assert.equal(task.ChallengeId, '4');
        done();
      });
    });
  });

  it('UserId refers to id of user', (done) => {

  });

});
