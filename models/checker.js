'use strict';
module.exports = function(sequelize, DataTypes) {
  var Checker = sequelize.define('Checker', {
    // UserId: DataTypes.INTEGER,
    // TaskId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.Task);
        this.belongsTo(models.User);
      }
    }
  });
  return Checker;
};
