import Exception from "exceptions/Exception";

/**
 * RangeException
 * Create custom exception with message
 *
 * @class RangeException
 * @exports module:exceptions/RangeException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class RangeException extends Exception {
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
