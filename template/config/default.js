const packageJson = require('../package.json');
const snakeCase = require('lodash/snakeCase');

module.exports = {
  knex: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgres',
      database: snakeCase(packageJson.name),
      charset: 'utf8',
    },
  },
  postgres: {
    schema: '{{schema}}',
  },
};
