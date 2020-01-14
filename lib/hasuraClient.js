const { GraphQLClient } = require('graphql-request');

const client = new GraphQLClient(process.env.HGE_ENDPOINT, {
  headers: {
    'x-hasura-admin-secret': process.env.ADMIN_SECRET,
  },
});

module.exports = client;
