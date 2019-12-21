const withHandleError = handler => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    next(e);
  }
};

export default withHandleError;
