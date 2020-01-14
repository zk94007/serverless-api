module.exports = () => ({
  after: (handler, next) => {
    const { headers, body, statusCode, ...rest } = handler.response;
    if (!body) {
      if (typeof rest === 'string') {
        return next();
      }
      handler.response = {
        headers,
        body: Array.isArray(handler.response)
          ? JSON.stringify(handler.response)
          : JSON.stringify(rest),
        statusCode: 200,
      };
      return next();
    }
    handler.response.body = JSON.stringify(body);
    handler.response.statusCode = statusCode || 200;
    next();
  },
});
