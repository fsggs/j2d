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
        define('io/InputHandler', ['api/Handler', 'io/InputHandlerCodes',
            'api/Device',
            'io/devices/Keyboard',
            'io/devices/Mouse',
            'io/devices/Joystick',
            'io/devices/Touch'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/Handler'), require('io/InputHandlerCodes'),
            require('api/Device'),
            require('io/devices/Keyboard'),
            require('io/devices/Mouse'),
            require('io/devices/Joystick'),
            require('io/devices/Touch')
        );
    } else {
        factory(root.j2d.api.Handler, root.j2d.io.InputHandlerCodes,
            root.j2d.api.Device,
            root.j2d.io.devices.Keyboard,
            root.j2d.io.devices.Mouse,
            root.j2d.io.devices.Joystick,
            root.j2d.io.devices.Touch
        );
    }
}(typeof window !== 'undefined' ? window : global, function (Handler, InputHandlerCodes, Device, Keyboard, Mouse, Joystick, Touch) {
    "use strict";

    /**
     * InputHandler
     * @constructor
     * @extends Handler
     */
    var InputHandler = function () {
        Handler.call(this);
        this.preventDefault = false;
        this.IO = [];
        this.options = {
            cursor: 'none'
        };

        this.store = {};

        this.data = {};

        this.keyCodeMap = {
            //DEBUG_INFO: [[InputHandler.KEY.KEY_CTRL, InputHandler.KEY.KEY_F1], 'j2d.debug.toggleScreen', {}],
            FULLSCREEN: [[InputHandler.KEY.KEY_CTRL, InputHandler.KEY.KEY_F11], 'j2d.scene.toggleFullScreen', {}]
        };

        this.bindListeners = function () {
            for (var i = 0; i < this.IO.length; i++) {
                if (this.IO[i].enable() === false) return false;
            }
        };

        this.unBindListeners = function () {
            for (var i = 0; i < this.IO.length; i++) {
                if (this.IO[i].disable() === false) return false;
            }
        };

        this.update = function () {
            if (!this.isEnabled) return false;
            for (var i = 0; i < this.IO.length; i++) {
                if (this.IO[i].update() === false) return false;
            }
            return true;
        };

        this.clear = function () {
            if (!this.isEnabled) return false;
            for (var i = 0; i < this.IO.length; i++) {
                if (this.IO[i].clear() === false) return false;
            }
            return true;
        };

        this.load = function (newKeyCodeMap) {
            var oldKeyCodeMap = JSON.stringify(this.keyCodeMap);
            this.keyCodeMap = JSON.parse(newKeyCodeMap);
            return oldKeyCodeMap;
        };

        this.save = function () {
            return JSON.stringify(this.keyCodeMap);
        };

        // TODO:: to refactoring

        var getPressData = function (manager, keyList) {
            return {
                keyList: keyList,
                time: manager.store.keys.pressedTime[keyList[0]]
            };
        };

        this.checkPressedKeyList = function (keyList) {
            if (typeof keyList === 'object' && keyList instanceof Array) {
                if (keyList.length !== this.data.keys.keysDown.length) {
                    return false;
                //} else if (this.data.keys.keysDown.equals(keyList)) {
                //    return getPressData(this, keyList);
                }
                return false;
            }
            if (isNaN(keyList)) return false;
            if (-1 !== this.data.keys.keysDown.indexOf(keyList)) {
                return getPressData(this, keyList);
            }
            return false;
        };

        this.checkPressedKeyMap = function (key) {
            if (this.keyCodeMap[key] === undefined) return false;
            return this.checkPressedKeyList(this.keyCodeMap[key][0]);
        };

        this.setKeys = function (mapObject) {
            //this.keyMap = $.extend(true, {}, this.keyMap, mapObject);
            return this;
        };

    };

    InputHandler.prototype = Object.create(Handler.prototype);
    InputHandler.prototype.constructor = InputHandler;

    InputHandler.interfaces = [];

    InputHandler.IO = {
        KEYBOARD: 'keyboard',
        JOYSTICK: 'joystick',
        MOUSE: 'mouse',
        TOUCH: 'touch'
    };

    var defaultIO = {
        KEYBOARD: Keyboard,
        JOYSTICK: Joystick,
        MOUSE: Mouse,
        TOUCH: Touch
    };

    InputHandler.KEY = InputHandler.prototype.KEY = InputHandlerCodes;
    InputHandler.KEYS_HELPER = InputHandler.prototype.KEYS_HELPER = {
        getKeyById: function (index) {
            return InputHandler.KEY[index] || 'KEY_UNKNOWN_' + index;
        },
        getKeyByCode: function (keyCode) {
            return InputHandler.KEY[keyCode] || 0;
        }
    };

    InputHandler.prototype.init = function (eventHandler, io, options) {
        Handler.prototype.init.call(this, eventHandler);
        if (options !== undefined && options !== null && typeof options === 'object') {
            this.options = options;
        }
        if (io !== undefined && io !== null && typeof io === 'object' && io instanceof Array) {
            this.IO = [];
            io.map(function (device) {
                if (typeof device === 'string' && InputHandler.IO[device.toUpperCase()] !== undefined) {
                    device = new (defaultIO[device.toUpperCase()])();
                    this.IO[device.toString()] = device;
                    this.IO.push(device);
                    if (this.IO[device].init(this) === false) {
                        throw new Error('Error. Device "' + device + '" not initialize.');
                    }
                } else if (typeof device === 'object' && device instanceof Device) {
                    this.IO[device.toString()] = device;
                    this.IO.push(device);
                    if (this.IO[device.toString()].init(this) === false) {
                        throw new Error('Error. Device "' + device + '" not initialize.');
                    }
                } else {
                    throw new Error('Error. Unknown IO device "' + device.toString() + '" is not supported yet.');
                }
            }.bind(this));
        }
        return this;
    };

    InputHandler.prototype.enable = function () {
        Handler.prototype.enable.call(this);
        this.bindListeners();
        return this;
    };

    InputHandler.prototype.disable = function () {
        Handler.prototype.disable.call(this);
        this.unBindListeners();
        return this;
    };

    InputHandler.prototype.toggle = function (status) {
        Handler.prototype.toggle.call(this, status);
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.InputHandler = InputHandler;
    if (global.j2d !== undefined) global.j2d.io.InputHandler = InputHandler;
    return InputHandler;
}));
