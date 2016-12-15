'use strict';
module.exports = function(sequelize, DataTypes) {
  var Challenge = sequelize.define('Challenge', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    pot: DataTypes.INTEGER,
    numberOfDays: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uuid: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // this.belongsToMany(models.User, { through: 'Tasks' });
        this.hasMany(models.Task);
        // this.belongsToMany(models.Checker, { through: 'Task' });
      }
    }
  });
  return Challenge;
};
