/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/Vector2d', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     * @class Vector2d
     * @exports module:utils/Vector2d
     * 
     * @constructor
     * @param {number} x
     * @param {number} y
     */
    var Vector2d = function (x, y) {
        this.x = x;
        this.y = y;
    };

    /**
     * @returns {number}
     */
    Vector2d.prototype.getX = function () {
        return this.x;
    };

    /**
     * @returns {number}
     */
    Vector2d.prototype.getY = function () {
        return this.y;
    };

    /**
     * @returns {{x: number, y: number}}
     */
    Vector2d.prototype.getVector = function () {
        return {x: this.x, y: this.y};
    };

    /**
     * @returns {Array.<number>}
     */
    Vector2d.prototype.toArray = function () {
        return [this.x, this.y];
    };

    /**
     * @param {Array.<number>} array
     * @returns {Vector2d}
     */
    Vector2d.prototype.fromArray = function (array) {
        this.x = array[0];
        this.y = array[1];

        return this;
    };

    /**
     * @returns {string}
     */
    Vector2d.prototype.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };

    /**
     * @param {Vector2d} vector1
     * @param {Vector2d} vector2
     * @returns {number}
     */
    Vector2d.getDistance = function (vector1, vector2) {
        return Math.sqrt(
            Math.pow(vector2.getVector().x - vector1.getVector().x, 2) +
            Math.pow(vector2.getVector().y - vector1.getVector().y, 2)
        );
    };

    /**
     * @param {Vector2d} vector1
     * @param {Vector2d} vector2
     * @returns {number}
     */
    Vector2d.getAngle = function (vector1, vector2) {
        return Math.atan2(
                vector2.getVector().y - vector1.getVector().y,
                vector2.getVector().x - vector1.getVector().x
            ) * (180 / Math.PI);
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Vector2d = Vector2d;
    if (global.j2d !== undefined) global.j2d.utils.Vector2d = Vector2d;
    return Vector2d
}));
