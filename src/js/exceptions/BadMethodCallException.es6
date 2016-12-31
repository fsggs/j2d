import Exception from "exceptions/Exception";

/**
 * BadMethodCallException
 * Create custom exception with message
 *
 * @class BadMethodCallException
 * @exports module:exceptions/BadMethodCallException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class BadMethodCallException extends Exception {
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
