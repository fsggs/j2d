/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 1.0.0-dev
 */

if (global === undefined) var global = window || this;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('api/Device', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     * Device
     * @constructor
     */
    var Device = function (input) {
        if (input !== undefined) this.input = input;
    };

    Device.prototype.enable = function () {
        return true;
    };

    Device.prototype.disable = function () {
        return true;
    };

    Device.prototype.init = function (input) {
        if (input !== undefined && this.input === undefined) this.input = input;
        return false;
    };

    Device.prototype.update = function () {
        return true;
    };

    Device.prototype.clear = function () {
        return true;
    };

    Device.prototype.toString = function () {
        return function (device) {
            return (device[0].toLowerCase() + device.slice(1))
        }(this.constructor.DeviceName || this.constructor.name);
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Device = Device;
    if (global.j2d !== undefined) global.j2d.api.Device = Device;
    return Device;
}));
