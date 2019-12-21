// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, req, res, _) => {
  console.log(error);
  const errorResponse = {
    statusCode: error.statusCode,
    message: error.message
  };
  return res.status(error.statusCode).json(errorResponse);
};

export default errorMiddleware;
