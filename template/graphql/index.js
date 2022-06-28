const { ApolloServer } = require('apollo-server-azure-functions');
const { readFileSync } = require('fs');
const { join } = require('path');
const { resolvers } = require('./resolvers');
const { dataSources } = require('./data-sources');
const { DateTimeResolver, DateTimeTypeDefinition } = require('graphql-scalars');

// Load the typesDefs from the schema file
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

// Create the Apollo Server and pass the typesDefs, resolvers and dataSources
const server = new ApolloServer({
  typeDefs: [DateTimeTypeDefinition, typeDefs],
  resolvers: [{ DateTime: DateTimeResolver }, resolvers],
  dataSources,
});

// Export the graphqlHandler for Azure Functions
exports.graphqlHandler = server.createHandler();
