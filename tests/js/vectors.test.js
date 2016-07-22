/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['utils/Vector2d', 'utils/Vector2dInteger'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/Vector2d'), require('utils/Vector2dInteger'));
    } else {
        factory(root.j2d.utils.Vector2d, root.j2d.utils.Vector2dInteger);
    }
}(typeof window !== 'undefined' ? window : global, function (Vector2d, Vector2dInteger) {
    "use strict";

    test('Vector2d()', function () {
        deepEqual((new Vector2d(1.2, 3.4)).toArray(), [1.2, 3.4]);
        var v2d = new Vector2d().fromArray([1.0, 2.1]);
        equal(v2d.getX(), 1.0);
        equal(v2d.getY(), 2.1);
        deepEqual(v2d.getVector(), {x: 1.0, y: 2.1});
        equal(v2d.toString(), '(1,2.1)')
    });

    test('Vector2dInteger()', function () {
        deepEqual((new Vector2dInteger().fromArray([5.2, -6.7])).toArray(), [5, -6]);
    });

}));
