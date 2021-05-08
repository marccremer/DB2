/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
require('dotenv').config();
const logger = require('logger').createLogger('logs/development.log'); // logs to a file
module.exports = {
  production: {
    client: 'oracledb',
    connection: {
      host: process.env.DB_REMOTE_HOST,
      user: process.env.DB_REMOTE_USER,
      password: process.env.DB_REMOTE_PW,
      database: process.env.DB_REMOTE_NAME,
    },
    seeds: {
      directory: './db/seeds',
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations',
    },
  },
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_LOCAL_HOST,
      user: process.env.DB_LOCAL_USER,
      password: process.env.DB_LOCAL_PW,
      database: process.env.DB_LOCAL_NAME,
    },
    seeds: {
      directory: './db/seeds',
      loadExtensions: ['.ts'] 
    },
    debug: true,
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations',
    },
    log: {
      // you can do custom things here with the messages before logging
      directory:'/logs',
      warn(message) {
        logger.warn(message);
      },
      error(message) {
        logger.error(message);
      },
      deprecate(message) {
        true;
      },
      debug(message) {
        logger.debug(message);
      },
    },
  },
};