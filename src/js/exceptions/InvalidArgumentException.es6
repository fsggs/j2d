import Exception from "exceptions/Exception";

/**
 * InvalidArgumentException
 * Create custom exception with message
 *
 * @class InvalidArgumentException
 * @exports module:exceptions/InvalidArgumentException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class InvalidArgumentException extends Exception {
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
