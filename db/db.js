const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);

const connectionString = process.env.DB_CONNECT;
const db = pgp(connectionString);

exports.db = db;