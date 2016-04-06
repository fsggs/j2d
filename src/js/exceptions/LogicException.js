/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/LogicException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * LogicException
     * Create custom exception with message
     *
     * @param {string} message
     * @property {string} message
     */
    var LogicException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    LogicException.prototype = Object.create(Exception.prototype);
    LogicException.prototype.constructor = LogicException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.LogicException = LogicException;
    if (typeof define !== 'function' || !define.amd) global.LogicException = LogicException;
    return LogicException;
}));
