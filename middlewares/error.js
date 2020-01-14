module.exports = opts => {
  const defaults = {
    logger: console.error
  };

  const options = Object.assign({}, defaults, opts);

  return {
    onError: (handler, next) => {
      handler.response = handler.response || {};
      handler.response.headers = handler.response.headers || {};
      handler.response.headers["Access-Control-Allow-Origin"] = "*";

      if (
        handler.error.constructor.super_ &&
        handler.error.constructor.super_.name === "HttpError"
      ) {
        if (typeof options.logger === "function") {
          options.logger(handler.error);
        }

        handler.response.statusCode = handler.error.statusCode;
        handler.response.body = handler.error.message;

        return next();
      }

      return next(handler.error);
    }
  };
};
