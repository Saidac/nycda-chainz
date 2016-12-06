'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // queryInterface.renameColumn('Challenges', 'winnerId', 'WinnerId');
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    // queryInterface.renameColumn('Challenges', 'WinnerId', 'winnerId');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
