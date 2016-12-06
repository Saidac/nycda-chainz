'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // queryInterface.renameColumn('Challenges', 'length', 'numberOfDay');
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    // queryInterface.renameColumn('Challenges', 'numberOfDay', 'length');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
