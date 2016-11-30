'use strict';
module.exports = function(sequelize, DataTypes) {
  var Checker = sequelize.define('Checker', {
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Checker;
};
