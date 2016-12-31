import Exception from "exceptions/Exception";

/**
 * UnexpectedValueException
 * Create custom exception with message
 *
 * @class UnexpectedValueException
 * @exports module:exceptions/UnexpectedValueException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class UnexpectedValueException extends Exception {
    constructor(message) {
        super(message)
    }

    /**
     * Convert exception to String
     * @returns {string}
     */
    toString = function () {
        return this.message;
    }
}
