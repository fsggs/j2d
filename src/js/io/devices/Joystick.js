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
        define('io/devices/Joystick', ['api/Device'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/Device'));
    } else {
        factory(root.j2d.api.Device);
    }
}(typeof window !== 'undefined' ? window : global, function (Device) {
    "use strict";

    var Joystick = function (input) {
        if (input !== undefined) this.input = input;

        this.init = function (input) {
            if (input !== undefined && this.input === undefined) this.input = input;
            return true;
        };

        this.update = function () {
            return true;
        };

        this.clear = function () {
            return true;
        };

        this.enable = function () {
            throw new Error('Error. IO interface "' + Joystick.IO + '" exist, but not supported yet.');
            //return true;
        };

        this.disable = function () {
            throw new Error('Error. IO interface "' + Joystick.IO + '" exist, but not supported yet.');
            //return true;
        };
    };

    Joystick.prototype = Object.create(Device.prototype);
    Joystick.prototype.constructor = Joystick;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Joystick = Joystick;
    if (global.j2d !== undefined) global.j2d.io.devices.Joystick = Joystick;
    return Joystick;
}));
