const _ = require('lodash');
const requireContext = require('require-context');
const knexConfig = require('../../knex');
const { assign } = _;
const context = requireContext(__dirname, false, /(?<!index)\.js/);
const dataSources = assign.apply(_, context.keys().map(context));

Object.keys(dataSources).map(key => {
  const Source = dataSources[key];
  dataSources[key] = new Source(knexConfig);
});

exports.dataSources = () => dataSources;
