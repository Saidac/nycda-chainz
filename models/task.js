'use strict';
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING
    },
<<<<<<< HEAD
    ChallengeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Challenges',
        key: 'id'
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
=======
    UserId: {
      type: DataTypes.INTEGER
    },
    ChallengeId: {
      type: DataTypes.INTEGER
>>>>>>> 34f2b23119a0fcab7923568631f3a18c7b132ec3
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.Challenge);
        this.belongsTo(models.User);
        this.hasMany(models.Checker);

      }
    }
  });
  return Task;
};
