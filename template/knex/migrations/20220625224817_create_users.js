const {
  postgres: { schema },
} = require('config');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex =>
  knex.raw('create extension if not exists "uuid-ossp"').then(() =>
    knex.schema
      .withSchema(schema)
      .hasTable('users')
      .then(exists => {
        if (!exists) {
          return knex.schema.withSchema(schema).createTable('users', table => {
            table
              .uuid('id')
              .defaultTo(knex.raw('uuid_generate_v4()'))
              .primary();
            table.string('uid').notNullable().unique();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.string('email').notNullable().unique();
            table.timestamps(true, true);
            table.index('uid');
            table.index('email');
          });
        }
      })
  );

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex =>
  knex.schema
    .withSchema(schema)
    .dropTable('users')
    .then(() => knex.raw('drop extension if exists "uuid-ossp"'));
