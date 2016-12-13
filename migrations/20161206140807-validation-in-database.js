'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('Users', 'passwordDigest', {
      type: Sequelize.STRING
    });
    
    return queryInterface.changeColumn('Challenges', 'numberOfDays', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
