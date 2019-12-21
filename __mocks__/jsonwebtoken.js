const jwt = require('jsonwebtoken');

module.exports = {
  ...jwt,
  verify: jest.fn().mockReturnValue({
    user: {}
  })
};
