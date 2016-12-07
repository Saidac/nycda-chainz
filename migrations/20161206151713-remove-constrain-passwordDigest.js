'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.changeColumn('Tasks', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {

        queryInterface.changeColumn('Tasks', 'name', {
          type: Sequelize.STRING,
          allowNull: false,
        });
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
