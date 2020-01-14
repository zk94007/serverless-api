const createError = require('http-errors');

module.exports = () => ({
  before: (handler, next) => {
    const { event } = handler;
    if (event.session) {
      next();
    } else {
      throw new createError.Unauthorized('You do not have permission to make this request');
    }
  }
});
