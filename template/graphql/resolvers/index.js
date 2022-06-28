const _ = require('lodash');
const { join } = require('path');
const requireContext = require('require-context');

// Load all the files in the resolvers directories by type, (query || mutation)
// and return them as resolvers that map to their export names
const resolversFor = type => {
  const context = requireContext(
    join(__dirname, type.toLowerCase()),
    false,
    /(?!index).*\.js$/
  );
  const resolvers = _.assign.apply(_, context.keys().map(context));

  return _.isEmpty(resolvers) ? null : resolvers;
};

// Construct the resolvers for Apollo Server
const resolvers = {};
const Query = resolversFor('query');
const Mutation = resolversFor('mutation');

if (Query) resolvers.Query = Query;
if (Mutation) resolvers.Mutation = Mutation;

exports.resolvers = resolvers;
