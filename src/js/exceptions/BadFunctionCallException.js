/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/BadFunctionCallException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.j2d.exceptions.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * BadFunctionCallException
     * Create custom exception with message
     *
     * @class BadFunctionCallException
     * @exports module:exceptions/BadFunctionCallException
     * 
     * @constructor
     * @extends exceptions/Exception
     * @param {string} message
     * @property {string} message
     */
    var BadFunctionCallException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    BadFunctionCallException.prototype = Object.create(Exception.prototype);
    BadFunctionCallException.prototype.constructor = BadFunctionCallException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.BadFunctionCallException = BadFunctionCallException;
    if (global.j2d === undefined) global.j2d.exceptions.BadFunctionCallException = BadFunctionCallException;
    return BadFunctionCallException;
}));
