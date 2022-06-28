exports.users = (_parent, __, { dataSources: { DefaultDataSource } }, _info) =>
  DefaultDataSource.users();
