import createError from 'http-errors';

const { NotFound } = createError;

/**
 * Represent the error of no wallet in database
 */
export default class WalletNotFoundError extends NotFound {
  constructor() {
    const MESSAGE = 'Wallet Not Found';
    super(MESSAGE);
  }
}
