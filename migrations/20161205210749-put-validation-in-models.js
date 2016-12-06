'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // queryInterface.changeColumn('Users', 'email', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   unique: true
    // });
    // queryInterface.changeColumn('Users', 'passwordDigest', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });
    // queryInterface.changeColumn('Users', 'passwordDigest', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });
    // queryInterface.changeColumn('Challenges', 'numberOfDays', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // });
    // queryInterface.changeColumn('Tasks', 'name', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });

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
