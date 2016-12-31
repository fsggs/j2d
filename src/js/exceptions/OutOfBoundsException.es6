import Exception from "exceptions/Exception";

/**
 * OutOfBoundsException
 * Create custom exception with message
 *
 * @class OutOfBoundsException
 * @exports module:exceptions/OutOfBoundsException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class OutOfBoundsException extends Exception {
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
