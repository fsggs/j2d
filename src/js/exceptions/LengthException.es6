import Exception from "exceptions/Exception";

/**
 * LengthException
 * Create custom exception with message
 *
 * @class LengthException
 * @exports module:exceptions/LengthException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class LengthException extends Exception {
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
