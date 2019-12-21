import createError from 'http-errors';

const { Forbidden } = createError;

/**
 * Represent the error if transaction make the balance to less than 0
 */
export default class PayeeAlreadyAdded extends Forbidden {
  constructor() {
    const MESSAGE = 'Payee already added';
    super(MESSAGE);
  }
}
