import Exception from "exceptions/Exception";

/**
 * LogicException
 * Create custom exception with message
 *
 * @class LogicException
 * @exports module:exceptions/LogicException
 *
 * @constructor
 * @extends Exception
 * @param {string} message
 * @property {string} message
 */
export default class LogicException extends Exception {
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
