module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": null,
    "database": "chainz",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": null,
    "database": "chainz-test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": null,
    "database": "chainz",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
};
