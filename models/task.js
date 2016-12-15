'use strict';
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING
    },

    // ChallengeId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'Challenges',
    //     key: 'id'
    //   }
    // },
    // UserId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'Users',
    //     key: 'id'
    //   }
    //
    // }
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
