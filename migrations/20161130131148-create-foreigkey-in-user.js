'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('Checkers', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    })

    queryInterface.changeColumn('Checkers', 'TaskId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Tasks',
        key: 'id'
      }
    })

    return queryInterface.changeColumn('Users', 'ChallengeId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Challenges',
        key: 'id'
      }
    })
    // queryInterface.addColumn('Users','ChallengeId', Sequelize.INTEGER);
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    // queryInterface.removeColumn('Users','ChallengeId');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
