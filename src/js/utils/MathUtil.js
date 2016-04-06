/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/MathUtil', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     *
     */
    var MathUtil = function () {
    };

    /**
     * @param {number} number
     * @returns {number}
     */
    MathUtil.number2Integer = function (number) {
        return number >> 0;
    };

    /**
     * @param {number} number
     * @returns {boolean}
     */
    MathUtil.isInteger = function (number) {
        return typeof number === "number" && isFinite(number)
            && number > -9007199254740992 && number < 9007199254740992
            && Math.floor(number) === number;
    };

    /**
     * @param {number} min
     * @param {number} max
     * @param {number} opacity
     * @returns {string}
     */
    MathUtil.randomColor = function (min, max, opacity) {
        return 'rgba('
            + MathUtil.random(min, max) + ', '
            + MathUtil.random(min, max) + ', '
            + MathUtil.random(min, max) + ', '
            + opacity + ')';
    };

    /**
     * @param {number} min
     * @param {number} max
     * @param {boolean} [omitZero]
     * @returns {number}
     */
    MathUtil.random = function (min, max, omitZero) {
        var random = (Math.floor(Math.random() * (max - min + 1) + min));
        return (omitZero && random == 0)
            ? MathUtil.random(min, max, omitZero)
            : random;
    };

    /**
     * @param {number} degree
     * @returns {number}
     */
    MathUtil.degree2Radian = function (degree) {
        return degree * (Math.PI / 180);
    };

    /**
     * @param {number} radian
     * @returns {number}
     */
    MathUtil.radian2Degree = function (radian) {
        return radian * (180 / Math.PI);
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.MathUtil = MathUtil;
    if (global.J2D === undefined) global.MathUtil = MathUtil;
    return MathUtil
}));
