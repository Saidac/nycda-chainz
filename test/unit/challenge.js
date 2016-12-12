var assert = require('assert');
var db = require('./../models');

describe('Challenge Model', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });
    it('can create a challenge', (done) => {
        db.Challenge.create({
          name: 'new year',
          numberOfDays:  '5',
          active: false

        }).then((challenge) => {
          assert.equal(challenge.name, 'new year');
          assert.equal(challenge.numberOfDays, '5');
          assert.equal(challenge.active, false);
           done();
        });
      });

    it('can update a challenge', (done) => {
        db.Challenge.update({
          name: 'new name',
          numberOfDays:  '6',
          active: true
        },{
          where:{
            name: 'new year'
          },
          returning:true
        }).then((updateData) => {
          var challenge = updateData[1][0];
          assert.equal(challenge.name, 'new name');
          assert.equal(challenge.numberOfDays, '6');
          assert.equal(challenge.active, true);
          done();

          });
        });
  it('can destroy a challenge', (done) => {

  });
  it('can not create a challenge without th numberOfDays', (done) => {

  });
  it('WinnerId refers to id of user', (done) => {

  });
});
