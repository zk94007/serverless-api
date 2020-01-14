const debug = require('debug')('APP:graphql');
const { ApolloServer } = require('apollo-server-lambda');
const _ = require('lodash');
const validateJWT= require('../lib/verifyJWT');
const schema = require('./schema');
const dataSources = require('./datasources');
const calendarService = require('../services/calendar');

const services = {
  calendarService,
};

const server = new ApolloServer({
  schema,
  context: async ({ event, context }) => {
    context.callbackWaitsForEmptyEventLoop = true;
    debug(event);
    const Authorization = event.headers.Authorization;
    const HasuraSecret = event.headers['X-Admin-Secret'];
    let isHasura = false;
    let user = null;
    if (Authorization) {
      const parts = Authorization.split(' ');
      const token = parts[1];
      user = await validateJWT(token);
    } else if (HasuraSecret && HasuraSecret === process.env.ADMIN_SECRET) {
      isHasura = true;
    } else {
      throw new Error('Not authenticated.');
    }

    return {
      headers: event.headers,
      functionName: context.functionName,
      identityId: event.requestContext.identity.cognitoIdentityId,
      user,
      userType: user && user['custom:usertype'],
      event,
      context,
      isHasura,
    }
  },
  dataSources: () => (
    {
      calendar: new dataSources.calendarDS(services),
    }
  ),
  formatError: (err) => {
    debug(err);
    delete err.extensions.exception;
    return err;
  }
});

exports.server = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  }
});
