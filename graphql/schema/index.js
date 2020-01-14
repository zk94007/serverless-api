const { makeExecutableSchema } = require('apollo-server-lambda');
const typeDefs = require('../types');
const resolvers = require('../resolvers');

module.exports =  makeExecutableSchema({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});
