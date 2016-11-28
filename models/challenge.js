'use strict';
module.exports = function(sequelize, DataTypes) {
  var Challenge = sequelize.define('Challenge', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    pot: DataTypes.INTEGER,
    days: DataTypes.INTEGER,
    winnerid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Challenge;
};
