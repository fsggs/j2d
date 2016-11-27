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
        define('io/devices/Keyboard', ['api/Device'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/Device'));
    } else {
        factory(root.j2d.api.Device);
    }
}(typeof window !== 'undefined' ? window : global, function (Device) {
    "use strict";

    var Keyboard = function (input) {
        if (input !== undefined) this.input = input;

        var keyDownEventHandler = function (e) {
            if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();
            if (!this.input.data.keys.keysDown.includes(e.keyCode)) {
                this.input.data.keys.keysDown.push(e.keyCode);
            }

            this.input.store.recordKeyPressTime = true;
            if (this.input.store.keys.pressedTime[e.keyCode] !== undefined) {
                this.input.store.keys.pressedTime[e.keyCode].delta = this.input.store.keys.pressedTime[e.keyCode].startTime - e.timeStamp
            } else {
                this.input.store.keys.pressedTime[e.keyCode] = {
                    startTime: e.timeStamp,
                    delta: 0
                };
            }

            this.input.events.trigger('io.keyboardKeyDown', e);
        }.bind(this);

        var keyUpEventHandler = function (e) {
            if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();
            if (!this.input.data.keys.keysUp.includes(e.keyCode)) {
                this.input.data.keys.keysUp.push(e.keyCode);
            }

            this.input.store.recordKeyPressTime = false;
            if (this.input.store.keys.pressedTime[e.keyCode] !== undefined) {
                this.input.store.keys.pressedTime.splice(e.keyCode, 1)
            }

            this.input.events.trigger('io.keyboardKeyUp', e);
        }.bind(this);

        this.init = function (input) {
            if (input !== undefined && this.input === undefined) this.input = input;
            this.input.data.keys = {
                keysUp: [],
                keysDown: []
            };
            this.input.store.keys = {
                pressedTime: []
            };
            this.input.store.recordKeyPressTime = false;
        };

        this.update = function () {
            return true;
        };

        this.clear = function () {
            if (this.input.data.keys !== undefined) {
                this.input.data.keys = {
                    keysUp: [],
                    keysDown: []
                };
            }
            return true;
        };

        this.enable = function () {
            window.addEventListener('keydown', keyDownEventHandler, false);
            window.addEventListener('keyup', keyUpEventHandler, false);
            return true;
        };
        this.disable = function () {
            window.removeEventListener('keydown', keyDownEventHandler, false);
            window.removeEventListener('keyup', keyUpEventHandler, false);
            return true;
        };
    };

    Keyboard.prototype = Object.create(Device.prototype);
    Keyboard.prototype.constructor = Keyboard;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Keyboard = Keyboard;
    if (global.j2d !== undefined) global.j2d.io.devices.Keyboard = Keyboard;
    return Keyboard;
}));
