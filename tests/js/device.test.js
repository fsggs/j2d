/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['utils/DeviceUtil', 'utils/Vector2dInteger'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/DeviceUtil'), require('utils/Vector2dInteger'));
    } else {
        factory(root.j2d.utils.DeviceUtil, root.j2d.utils.Vector2dInteger);
    }
}(typeof window !== 'undefined' ? window : global, function (Device, Vector2dInteger) {
    "use strict";

    test('DeviceUtil()', function () {
        var device = (new Device()).onResize();
        deepEqual(device.getSize(), new Vector2dInteger(400, 300));
        equal(device.getWidth(), 400);
        equal(device.getHeight(), 300);
    });

}));
