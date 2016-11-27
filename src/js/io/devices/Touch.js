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
        define('io/devices/Touch', ['io/devices/Pointer'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('io/devices/Pointer'));
    } else {
        factory(root.j2d.io.devices.Pointer);
    }
}(typeof window !== 'undefined' ? window : global, function (Pointer) {
    "use strict";

    var Touch = function (input) {
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
            throw new Error('Error. IO interface "' + Touch.IO + '" exist, but not supported yet.');
            //return true;
        };
        this.disable = function () {
            throw new Error('Error. IO interface "' + Touch.IO + '" exist, but not supported yet.');
            //return true;
        };
    };

    Touch.prototype = Object.create(Pointer.prototype);
    Touch.prototype.constructor = Touch;

    Touch.DeviceName = Pointer.prototype.constructor.name; // this fix device name in InputHandler

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Touch = Touch;
    if (global.j2d !== undefined) global.j2d.io.devices.Touch = Touch;
    return Touch;
}));
