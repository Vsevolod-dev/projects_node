require('dotenv').config()

// config for sequalize migrations
module.exports = {
    "development": {
      "username": process.env.DB_USER,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_SCHEMA,
      "host": process.env.DB_HOST,
      "dialect": process.env.DB_DIALECT
    }
  }