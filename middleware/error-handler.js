const errorHandlerMiddleware = (err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({
      message: err.message || 'Something went wrong, try again later.',
      data: err.data,
    });
};

module.exports = errorHandlerMiddleware;
