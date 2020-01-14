const verifyJWT = require('../lib/verifyJWT');

module.exports = () => ({
  before: (handler, next) => {
    const { event: { headers } } = handler;
    const { Authorization } = headers;
    const HasuraSecret = headers['X-Admin-Secret'];
    if (Authorization) {
      const parts = Authorization.split(' ');
      const token = parts[1];
      verifyJWT(token.trim()).then(
        resp => {
          handler.event.user = resp;
        },
        (err) => next(err)
      )
    } else if (HasuraSecret && HasuraSecret === process.env.ADMIN_SECRET) {
      handler.event.isHasura = true;
    }
    return next()
  }
});
