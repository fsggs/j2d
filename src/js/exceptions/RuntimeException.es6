import Exception from "exceptions/Exception";

/**
 * RuntimeException
 * Create custom exception with message
 *
 * @class RuntimeException
 * @exports module:exceptions/RuntimeException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class RuntimeException extends Exception {
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
