var assert = require('assert');
var db = require('../../models');

describe('Task Model', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  it('can create a task', (done) => {
    // you must create the challenge first
    db.User.create({
      name:'sara',
      surname:'saraw',
      email: 'gh@d.com',
      id: 3
    }).then((user) => {

    db.Challenge.create({
      name: 'new year',
      active: true,
      numberOfDays: 3,
      id: 4
    }).then((challenge)=>{
      db.Task.create({
        name: 'learning spanish',
        ChallengeId: 4,
        UserId: 3

    }).then((task) => {
        assert.equal(task.name, 'learning spanish');
        assert.equal(task.ChallengeId, 4);
        assert.equal(task.UserId, 3);
        done();
        });
      });
    });
  });




  it('can update a task');

  // it('can not create a task with a wrong  ChallengeId or without a ChallengeId ', (done) => {
  //   db.Task.create({
  //     name: 'a new one',
  //     ChallengeId: 678,
  //     UserId:4
  //
  //   }).catch((error) => {
  //     console.log('error for ChallengeId is wrong: ');
  //     console.log(error.errors[0].message);
  //
  //     assert.equal(error.errors[0].message, 'ChallengeId is wrong');
  //     assert.equal(error.errors.length, 1);
  //     done();
  //   });
  // });

  it('can not create a task with a wrong  ChallengeId or without a ChallengeId ', (done) => {
    // you must create the challenge first
    db.User.create({
      name:'sar',
      surname:'sar',
      email: 'ghe@d.com',
      id: 5
    }).then((user) => {
      db.Challenge.create({
        name: 'new ',
        active: true,
        numberOfDays: 6,
        id: 6
      }).then((challenge)=>{
        db.Task.create({
          name: 'learning ',
          UserId: 5
        }).catch((error) => {
          console.log('error for ChallengeId is wrong: ');
          console.log(error.message);
          assert.equal(error.message, 'null value in column "ChallengeId" violates not-null constraint');
          done();
        });
      });
    });
  });

  it('UserId refers to id of user');

});
