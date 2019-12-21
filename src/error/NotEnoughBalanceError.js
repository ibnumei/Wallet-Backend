import createError from 'http-errors';

const { Forbidden } = createError;

/**
 * Represent the error if transaction make the balance to less than 0
 */
export default class NotEnoughBalanceError extends Forbidden {
  constructor() {
    const MESSAGE = 'Transaction make the balance less than 0';
    super(MESSAGE);
  }
}
