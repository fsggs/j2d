/**
 * Default Exception
 * Create custom exception with message
 *
 * @class Exception
 * @exports module:exceptions/Exception
 *
 * @constructor
 * @extends Error
 * @param {string} message
 * @property {string} message
 */
export default class Exception extends Error {
    constructor(message) {
        super(message);
        this.message = message;

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    }
}
