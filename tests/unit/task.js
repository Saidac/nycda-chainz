var assert = require('assert');
var db = require('../../models');

describe('Task Model', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  it('can create a task', (done) => {
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

  it('can not create a task without a ChallengeId ', (done) => {
    db.User.create({
      name:'sar',
      surname:'sar',
      email: 'ghe@d.com',
      id: 5
    }).then((user) => {
        return db.Challenge.create({
          name: 'new ',
          active: true,
          numberOfDays: 6,
          id: 6
          });
        }).then((challenge)=>{
            return db.Task.create({
              name: 'learning ',
              UserId: 5
              });
            }).catch((error) => {
              assert.equal(error.message, 'null value in column "ChallengeId" violates not-null constraint');
              done();
            });
          });


  it('can not create a task  without a UserId ',(done) => {
    db.User.create({
      name:'sardab',
      surname:'sarsa',
      email: 'gheew@d.com',
      id: 36

    }).then((user) => {
      return  db.Challenge.create({
          name: 'new title ',
          active: true,
          numberOfDays: 6,
          id: 34
          });
        }).then((challenge)=>{
          return  db.Task.create({
              name: 'learning some cooking ',
              ChallengeId:34
              });
            }).catch((error) => {
              assert.equal(error.message, 'null value in column "UserId" violates not-null constraint');
              done();
            });
          });



    it('can not create a task  with a wrong UserId ');
    it('can not create a task  with a wrong ChallengeId ');


});
