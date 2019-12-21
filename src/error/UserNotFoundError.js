import createError from 'http-errors';

const { NotFound } = createError;

/**
 * Represent the error of no user in database
 */
export default class UserNotFoundError extends NotFound {
  constructor() {
    const MESSAGE = 'User Not Found';
    super(MESSAGE);
  }
}
