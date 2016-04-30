/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/Exception', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

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
    var Exception = function (message) {
        Error.call(this, message);
        this.message = message;

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    Exception.prototype = Object.create(Error.prototype);
    Exception.prototype.constructor = Exception;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Exception = Exception;
    if (global.j2d === undefined) global.j2d.exceptions.Exception = Exception;
    return Exception;
}));
