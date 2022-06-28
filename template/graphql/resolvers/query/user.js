exports.user = (
  _parent,
  { id },
  { dataSources: { DefaultDataSource } },
  _info
) => DefaultDataSource.user({ id });
