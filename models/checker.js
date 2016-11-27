'use strict';
module.exports = function(sequelize, DataTypes) {
  var Checker = sequelize.define('Checker', {
    userid: DataTypes.INTEGER,
    taskid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Checker;
};