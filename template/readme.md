<p align="center">
  <img width="250" src="logo.png" alt="logo">
</p>
<h1 align="center" style="margin-top: -5px;color:gray;">{{name}}</h1>

## Introduction

This starter kit is a Azure Functions integration of Apollo Server that includes a full working example of GraphQL operations for a `User` using [knex](https://www.npmjs.com/package/knex) for SQL operations and a `docker-compose.json` file with a `postgres` service for local development.

Apollo Server is a community-maintained open-source GraphQL server that works with many Node.js HTTP server frameworks. A full example of how to use `apollo-server-azure-functions` can be found in [the docs](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-azure-functions), including a [full tutorial](https://www.apollographql.com/docs/apollo-server/deployment/azure-functions/).


## Prerequisites
- Setup an [Azure](https://azure.microsoft.com/en-us/) account
- Install the [Azure Functions Core Tools CLI](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cmacos%2Ccsharp%2Cportal%2Cbash#v2)
- Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Getting started

### Docker

Start the docker `postgres` service:

```sh
docker compose up -d
```

### Knex

Run the migrations and seed the database:
```sh
yarn knex migrate:latest
yarn knex seed:run
```

### Azure Functions

Start the Azure Functions development server:
```sh
yarn start
```

Apollo Server should now be up and running! If you go to http://localhost:7071/graphql in your browser, you can now open up Apollo Sandbox and run operations against your server. [Read the docs](https://www.apollographql.com/docs/apollo-server/). [Read the CHANGELOG](https://github.com/apollographql/apollo-server/blob/main/CHANGELOG.md).

## Configuration

Server configuration uses the [config](https://www.npmjs.com/package/config) package. The file `config/default.js` is a (non-environment specific) default configuration that contains a `knex.client` and a `knex.connection` configuration as well as `postgres.schema`. Additional reading on more complicated configurations can be found in [the config documentation](https://github.com/node-config/node-config#readme).

## Exploring the code

Let's get started with the entry point of the Azure Function:


```js
// graphql/index.js

 1: const { ApolloServer } = require('apollo-server-azure-functions');
 2: const { readFileSync } = require('fs');
 3: const { join } = require('path');
 4: const { resolvers } = require('./resolvers');
 5: const { dataSources } = require('./data-sources');
 6: const { DateTimeResolver, DateTimeTypeDefinition } = require('graphql-scalars');
 7: 
 8: // Load the typesDefs from the schema file
 9: const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');
10:
11: // Create the Apollo Server and pass the typesDefs, resolvers and dataSources
12: const server = new ApolloServer({
13:   typeDefs: [DateTimeTypeDefinition, typeDefs],
14:   resolvers: [{ DateTime: DateTimeResolver }, resolvers],
15:   dataSources,
16: });
17:
18: // Export the graphqlHandler for Azure Functions
19: exports.graphqlHandler = server.createHandler();
```

### Type definitions
This starter kit includes GrqphQL type definitions for `User` and related `Query` and `Mutations` types and their inputs types. The schema containing those types is loaded (_see line 9 above_) and passed to the Apollo Server (_see line 13 above_). Additionally, in this starter kit, `DateTimeTypeDefinition` has also been added in order to use the `DateTime` type from the `graphql-scalars` package.

Additional types can either be added to the `graphql/schema.graphql` file or additional schema files can be used. For example:

```js
...
// Load the typesDefs from the schema files
const userTypeDefs = readFileSync(join(__dirname, 'user.graphql'), 'utf-8');
const someOtherTypeDefs = readFileSync(join(__dirname, 'other.graphql'), 'utf-8');

// Create the Apollo Server and pass the typesDefs, resolvers and dataSources
const server = new ApolloServer({
  typeDefs: [DateTimeTypeDefinition, userTypeDefs, someOtherTypeDefs],
  resolvers: [{ DateTime: DateTimeResolver }, resolvers],
  dataSources,
});
...
```

### Resolvers
All the [resolvers](https://www.apollographql.com/docs/apollo-server/data/resolvers) live in either `graphql/resolvers/query` or `graphql/resolvers/query`. Resolvers are imported (_see line 4 above_) and passed to the Apollo Server upon creation (_see line 14 above_). Additionally, in this starter kit, `DateTimeResolver` has also been added in order to use the `DateTime` type from the `graphql-scalars` package.

Resolvers are loaded automatically from those directories and are then attached to either `resolvers.Query` or `resolvers.Mutation`. If you want to see how that is done, check out `graphql/resolvers/index.js`. 

### Data sources

Data sources are where the real work gets done by `knex`. The data passed in to the GraphQL calls is passed to the `resolvers` and finally to the data source function. Much like how the resolvers are loaded, the data sources are also loaded for you. To see how that is done, check out `graphql/data-sources/index.js`.

Here is an example of the implementation of `resolvers.Query.users`:

```js
  users() {
    return this.knex.select('*').from(`${schema}.users`);
  }
```

Each data source is a JavaScript `class` that extends a `SQLDataSource`. For additional information see [datasource-sql](https://github.com/cvburgess/SQLDataSource#readme).

## Adding additional entities

This kit includes an example entity `User` and related types, queries and mutations. In order for you to make use of this starter kit, you will want to add your own entities. Adding a new entity involves three steps:

1. Add your new types to the `typeDefs`. See **Type definitions** above
2. Add resolvers for your new `typeDefs` if they contain a new `Query` or `Mutation`. To add a new resolver, create a new file in either `graphql/resolvers/query` or `graphql/resolvers/mutation` depending on the type of the resolver. The included examples for `User` should give you a good template to work from.
  
3. Implement the data source for your new resolvers. See **Data sources** above

