const { knex } = require('config');
const knexStringcase = require('knex-stringcase');

module.exports = knexStringcase(knex);
