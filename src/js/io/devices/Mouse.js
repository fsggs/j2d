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
        define('io/devices/Mouse', ['io/devices/Pointer'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('io/devices/Pointer'));
    } else {
        factory(root.j2d.io.devices.Pointer);
    }
}(typeof window !== 'undefined' ? window : global, function (Pointer) {
    "use strict";

    var Mouse = function (input) {
        Pointer.call(this, input);

        var __fixMouseButtonId = function (id) {
            if (id > 2) {
                return id;
            } else if (id === 0) {
                return 'LEFT';
            } else if (id === 1) {
                return 'MIDDLE';
            } else if (id === 2) {
                return 'RIGHT';
            }
        };

        var keyMouseDownEventHandler = function (e) {
            if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();

            var keyCode = this.input.KEYS_HELPER.getKeyById('KEY_MOUSE_' + __fixMouseButtonId(e.button));
            if (!this.input.data.keys.keysDown.includes(keyCode)) {
                this.input.data.keys.keysDown.push(keyCode);
            }

            this.input.store.recordMouseDragDistance = true;
            this.input.store.pointer = {
                tracker: {
                    x: e.pageX,
                    y: e.pageY
                }
            };

            this.input.store.recordMouseClickTime = true;
            if (this.input.store.keys.pressedTime[keyCode] !== undefined) {
                this.input.store.keys.pressedTime[keyCode].delta = this.input.store.keys.pressedTime[keyCode].startTime - e.timeStamp
            } else {
                this.input.store.keys.pressedTime[keyCode] = {
                    startTime: e.timeStamp,
                    delta: 0
                };
            }

            this.input.events.trigger('io.mouseKeyDown', e);
        }.bind(this);

        var keyMouseUpEventHandler = function (e) {
            if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();

            var keyCode = this.input.KEYS_HELPER.getKeyById('KEY_MOUSE_' + __fixMouseButtonId(e.button));
            if (!this.input.data.keys.keysUp.includes(keyCode)) {
                this.input.data.keys.keysUp.push(keyCode);
            }

            this.input.store.recordMouseDragDistance = false;
            this.input.data.pointer.distance = 0;
            this.input.store.pointer = {
                tracker: {
                    x: 0,
                    y: 0
                }
            };

            this.input.store.recordMouseClickTime = false;
            if (this.input.store.keys.pressedTime[keyCode] !== undefined) {
                this.input.store.keys.pressedTime.splice(keyCode, 1)
            }

            this.input.events.trigger('io.mouseKeyUp', e);
        }.bind(this);

        var keyMouseMoveEventHandler = function (e) {
            if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();

            this.input.data.pointer = {
                x: e.pageX,
                y: e.pageY,
                distance: (this.input.store.recordMouseDragDistance) ? Math.sqrt(
                    Math.pow((e.pageX - this.input.store.pointer.tracker.x), 2)
                    + Math.pow((e.pageY - this.input.store.pointer.tracker.y), 2)
                ).toFixed(2) : 0.0,
                image: this.input.data.pointer.image
            };

            this.input.events.trigger('io.mouseMove', e);
        }.bind(this);

        var scrollMouseEventHandler = function (e) {
            if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();

            var keyCode = (e.wheelDelta / 120 > 0)
                ? this.input.KEYS_HELPER.getKeyById('SCROLL_MOUSE_UP')
                : this.input.KEYS_HELPER.getKeyById('SCROLL_MOUSE_DOWN');

            if (!this.input.data.keys.keysUp.includes(keyCode)) {
                this.input.data.keys.keysUp.push(keyCode);
                this.input.data.keys.keysDown.push(keyCode);
            }

            this.input.events.trigger('io.mouseScroll', e);
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
            this.input.data.pointer = {
                image: this.input.options.cursor || 'none',
                x: 0,
                y: 0,
                distance: 0
            };
            this.input.store.pointer = {
                tracker: {
                    x: 0,
                    y: 0
                },
                image: this.input.options.cursor || 'none'
            };
            this.input.store.recordMouseDragDistance = false;
            this.input.store.recordMouseClickTime = false;
            this.setPointerImage(this.input.options.cursor || 'none');
        };

        this.update = function () {
            //TODO:: fix pointer by viewport scene
            return true;
        };

        this.clear = function () {
            if (this.input.data.keys !== undefined) {
                this.input.data.keys = {
                    keysUp: [],
                    keysDown: []
                };
            }
            if (this.input.data.pointer !== undefined) {
                this.input.data.pointer = {
                    image: this.input.options.pointer || 'none',
                    x: 0,
                    y: 0,
                    distance: 0
                };
            }
            return true;
        };

        this.enable = function () {
            window.addEventListener('mousedown', keyMouseDownEventHandler, false);
            window.addEventListener('mouseup', keyMouseUpEventHandler, false);
            window.addEventListener('mousemove', keyMouseMoveEventHandler, false);
            window.addEventListener('wheel', scrollMouseEventHandler, false);
            return true;
        };

        this.disable = function () {
            window.removeEventListener('mousedown', keyMouseDownEventHandler, false);
            window.removeEventListener('mouseup', keyMouseUpEventHandler, false);
            window.removeEventListener('mousemove', keyMouseMoveEventHandler, false);
            window.removeEventListener('wheel', scrollMouseEventHandler, false);
            return true;
        };
    };

    Mouse.prototype = Object.create(Pointer.prototype);
    Mouse.prototype.constructor = Mouse;

    Mouse.DeviceName = Pointer.prototype.constructor.name; // this fix device name in InputHandler

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Mouse = Mouse;
    if (global.j2d !== undefined) global.j2d.io.devices.Mouse = Mouse;
    return Mouse;
}));
