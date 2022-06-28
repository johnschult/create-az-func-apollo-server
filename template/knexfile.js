const {
  knex,
  postgres: { schema },
} = require('config');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    ...knex,
    migrations: {
      schemaName: schema,
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds/development',
    },
  },
};
