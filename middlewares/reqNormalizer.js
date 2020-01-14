const _ = require('lodash');

function getCookiesFromHeader(headers) {
  if (headers === null || headers === undefined || headers.Cookie === undefined) {
    return {};
  }
  var list = {},
    rc = headers.Cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    var key = parts.shift().trim();
    var value = decodeURI(parts.join('='));
    if (key !== '') {
      list[key] = value
    }
  });

  return list;
}

module.exports = () => ({
  before: (handler, next) => {
    const { event } = handler;
    if (event.hasOwnProperty('httpMethod')) {
      event.query = event.queryStringParameters;
      event.params = _.reduce(event.pathParameters, ((memo, val, key) => {
        memo[key] = decodeURIComponent(val);
        return memo;
      }), {});
      event.cookies = getCookiesFromHeader(event.headers);
      event.user = _.get(event.requestContext, 'authorizer.claims');
    }

    return next()
  }
});

