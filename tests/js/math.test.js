/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['utils/MathUtil'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/MathUtil'));
    } else {
        factory(root.MathUtil);
    }
}(typeof window !== 'undefined' ? window : global, function (MathUtil) {
    "use strict";

    test('MathUtil number2Integer()', function () {
        equal(MathUtil.number2Integer(2.1), 2);
        ok(MathUtil.isInteger(MathUtil.number2Integer(2.1)));
    });

    test('MathUtil isInteger()', function () {
        ok(MathUtil.isInteger(2));
        ok(!MathUtil.isInteger(2.1));
    });

    test('MathUtil randomColor()', function () {
        ok(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.test(MathUtil.randomColor(0, 255, 1)));
    });

    test('MathUtil random()', function () {
        var number = MathUtil.random(0, 1, false);
        ok(MathUtil.isInteger(number) && (number === 0 || number === 1));

        number = MathUtil.random(0, 1, true);
        ok(MathUtil.isInteger(number) && number === 1);
    });

    test('MathUtil degree2Radian()', function () {
        equal(MathUtil.degree2Radian(60), 60 * (Math.PI / 180));
    });

    test('MathUtil radian2Degree()', function () {
        equal(MathUtil.radian2Degree(1.0471975511965976), 1.0471975511965976 * (180 / Math.PI));
    });

}));
