const { faker } = require('@faker-js/faker');
const {
  postgres: { schema },
} = require('config');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(`${schema}.users`).del();

  // Construct the records
  const recordsLength = Array.from(Array(100).keys());

  const records = recordsLength.map(() => ({
    uid: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
  }));

  //  Insert the records
  await knex(`${schema}.users`)
    .insert(records)
    .then(() => {
      console.log('Seeded 100 users');
    });
};
