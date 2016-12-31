import Exception from "exceptions/Exception";

/**
 * OutOfRangeException
 * Create custom exception with message
 *
 * @class OutOfRangeException
 * @exports module:exceptions/OutOfRangeException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class OutOfRangeException extends Exception {
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
