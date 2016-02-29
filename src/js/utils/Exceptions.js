/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/Exceptions', [], factory);
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
     * @param {string} message
     */
    var Exception = function (message) {
        Error.call(this);
        this.message = message;

        /**
         * Convert exception to String
         * @returns {string|}
         */
        this.toString = function () {
            return this.message;
        }
    };

    Exception.prototype = Object.create(Error.prototype);
    Exception.prototype.constructor = Exception;

    /**
     * RuntimeException
     * Create RuntimeException exception with message
     *
     * @param {string} message
     */
    var RuntimeException = function (message) {
        Exception.call(this, message);
    };

    RuntimeException.prototype = Object.create(Exception.prototype);
    RuntimeException.prototype.constructor = RuntimeException;

    /**
     * InvalidArgumentException
     * Create InvalidArgumentException exception with message
     *
     * @param {string} message
     */
    var InvalidArgumentException = function (message) {
        Exception.call(this, message);
    };

    InvalidArgumentException.prototype = Object.create(Exception.prototype);
    InvalidArgumentException.prototype.constructor = InvalidArgumentException;

    /**
     * BadFunctionCallException
     * Create BadFunctionCallException exception with message
     *
     * @param {string} message
     */
    var BadFunctionCallException = function (message) {
        Exception.call(this, message);
    };

    BadFunctionCallException.prototype = Object.create(Exception.prototype);
    BadFunctionCallException.prototype.constructor = BadFunctionCallException;

    /**
     * BadMethodCallException
     * Create BadMethodCallException exception with message
     *
     * @param {string} message
     */
    var BadMethodCallException = function (message) {
        Exception.call(this, message);
    };

    BadMethodCallException.prototype = Object.create(Exception.prototype);
    BadMethodCallException.prototype.constructor = BadMethodCallException;

    /**
     * LengthException
     * Create LengthException exception with message
     *
     * @param {string} message
     */
    var LengthException = function (message) {
        Exception.call(this, message);
    };

    LengthException.prototype = Object.create(Exception.prototype);
    LengthException.prototype.constructor = LengthException;

    /**
     * LogicException
     * Create LogicException exception with message
     *
     * @param {string} message
     */
    var LogicException = function (message) {
        Exception.call(this, message);
    };

    LogicException.prototype = Object.create(Exception.prototype);
    LogicException.prototype.constructor = LogicException;

    /**
     * OutOfBoundsException
     * Create OutOfBoundsException exception with message
     *
     * @param {string} message
     */
    var OutOfBoundsException = function (message) {
        Exception.call(this, message);
    };

    OutOfBoundsException.prototype = Object.create(Exception.prototype);
    OutOfBoundsException.prototype.constructor = OutOfBoundsException;

    /**
     * OutOfRangeException
     * Create OutOfRangeException exception with message
     *
     * @param {string} message
     */
    var OutOfRangeException = function (message) {
        Exception.call(this, message);
    };

    OutOfRangeException.prototype = Object.create(Exception.prototype);
    OutOfRangeException.prototype.constructor = OutOfRangeException;

    /**
     * RangeException
     * Create RangeException exception with message
     *
     * @param {string} message
     */
    var RangeException = function (message) {
        Exception.call(this, message);
    };

    RangeException.prototype = Object.create(Exception.prototype);
    RangeException.prototype.constructor = RangeException;

    /**
     * UnexpectedValueException
     *
     * Create UnexpectedValueException exception with message
     * @param {string} message
     */
    var UnexpectedValueException = function (message) {
        Exception.call(this, message);
    };

    UnexpectedValueException.prototype = Object.create(Exception.prototype);
    UnexpectedValueException.prototype.constructor = UnexpectedValueException;

    if (global.exports !== undefined) {
        global.exports.Exception = Exception;
        global.exports.RuntimeException = RuntimeException;
        global.exports.InvalidArgumentException = InvalidArgumentException;
        global.exports.BadFunctionCallException = BadFunctionCallException;
        global.exports.BadMethodCallException = BadMethodCallException;
        global.exports.LengthException = LengthException;
        global.exports.LogicException = LogicException;
        global.exports.OutOfBoundsException = OutOfBoundsException;
        global.exports.OutOfRangeException = OutOfRangeException;
        global.exports.RangeException = RangeException;
        global.exports.UnexpectedValueException = UnexpectedValueException;
    }

    if (typeof define !== 'function' || !define.amd) {
        global.Exception = Exception;
        global.RuntimeException = RuntimeException;
        global.InvalidArgumentException = InvalidArgumentException;
        global.BadFunctionCallException = BadFunctionCallException;
        global.BadMethodCallException = BadMethodCallException;
        global.LengthException = LengthException;
        global.LogicException = LogicException;
        global.OutOfBoundsException = OutOfBoundsException;
        global.OutOfRangeException = OutOfRangeException;
        global.RangeException = RangeException;
        global.UnexpectedValueException = UnexpectedValueException;
    }
}));
