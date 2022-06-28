exports.addUser = (
  _parent,
  { input },
  { dataSources: { DefaultDataSource } },
  _info
) =>
  DefaultDataSource.addUser({
    input,
  });
