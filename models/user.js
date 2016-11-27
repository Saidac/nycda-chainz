'use strict';
const bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password:{
      type: DataTypes.VIRTUAL,
      set: function(password){
        this.setDataValue('passwordDigest', bcrypt.hashSync(password, 10));
    }

  },
    passwordDigest: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
