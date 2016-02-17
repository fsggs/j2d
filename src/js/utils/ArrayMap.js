/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/ArrayMap', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    var ArrayMap = function (args) {
        Array.call(this, args);
    };

    ArrayMap.prototype = Object.create(Array.prototype);
    ArrayMap.prototype.constructor = ArrayMap;

    ArrayMap.prototype.last = function () {
        return this[this.length - 1];
    };

    /**
     * @param {ArrayMap.<T>} array
     * @returns {boolean}
     */
    ArrayMap.prototype.equals = function (array) {
        if (!array)
            return false;

        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(ArrayMap.prototype, 'equals', {enumerable: false});

    /**
     * @param {string|Object} object
     * @returns {boolean}
     */
    ArrayMap.prototype.contains = function (object) {
        var i = this.length;
        while (i--) {
            if (this[i] === object) {
                return true;
            }
        }
        return false;
    };
    Object.defineProperty(ArrayMap.prototype, 'contains', {enumerable: false});

    /**
     * @param {Function} callback
     * @returns {boolean}
     */
    ArrayMap.prototype.each = function (callback) {
        if (!callback) return false;
        var result = false;
        for (var i = 0; i < this.length; i++) {
            if ((result = callback(this[i], i)) == false) {
                return result;
            }
        }
        return result;
    };
    Object.defineProperty(ArrayMap.prototype, 'each', {enumerable: false});

    /**
     * @param {string|Object} key
     * @param {*} value
     * @returns {ArrayMap.<T>}
     */
    ArrayMap.prototype.add = function (key, value) {
        if (this.contains(key))
            this[key] = value;
        else {
            this.push(key);
            this[key] = value;
        }
        return this;
    };
    Object.defineProperty(ArrayMap.prototype, 'add', {enumerable: false});

    /**
     * @param {string|Object} key
     * @returns {ArrayMap.<T>}
     */
    ArrayMap.prototype.remove = function (key) {
        for (var i = 0; i < this.length; ++i) {
            if (this[i] == key) {
                this.splice(i, 1);
                delete this[key];
                return this;
            }
        }
        return this;
    };
    Object.defineProperty(ArrayMap.prototype, 'remove', {enumerable: false});

    if (typeof define !== 'function' || !define.amd) global.ArrayMap = ArrayMap;

    return ArrayMap;
}));
