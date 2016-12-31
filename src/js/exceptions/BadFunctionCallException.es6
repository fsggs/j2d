import Exception from "exceptions/Exception";

/**
 * BadFunctionCallException
 * Create custom exception with message
 *
 * @class BadFunctionCallException
 * @exports module:exceptions/BadFunctionCallException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class BadFunctionCallException extends Exception {
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
