const { SQLDataSource } = require('datasource-sql');
const {
  postgres: { schema },
} = require('config');

class DefaultDataSource extends SQLDataSource {
  users() {
    return this.knex.select('*').from(`${schema}.users`);
  }

  user({ id }) {
    return this.knex.first('*').from(`${schema}.users`).where({ id });
  }

  addUser({ input }) {
    return this.knex(`${schema}.users`)
      .insert({ ...input })
      .returning('*')
      .then(res => res[0]);
  }
}

exports.DefaultDataSource = DefaultDataSource;
