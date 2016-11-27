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
        define('io/devices/Pointer', ['api/Device'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/Device'));
    } else {
        factory(root.j2d.core.Device);
    }
}(typeof window !== 'undefined' ? window : global, function (Device) {
    "use strict";

    var Pointer = function (input) {
        if (input !== undefined) this.input = input;
        if (this.constructor.name === 'Pointer') {
            throw new Error('Error. Pointer is abstract class.');
        }

        this.setPointerImage = function (image) {
            if (image) {
                switch (image) {
                    case 'none':
                    case 'default':
                    case 'auto':
                    case 'crosshair':
                    case 'e-resize':
                    case 'help':
                    case 'move':
                    case 'n-resize':
                    case 'ne-resize':
                    case 'nw-resize':
                    case 'pointer':
                    case 'progress':
                    case 's-resize':
                    case 'se-resize':
                    case 'sw-resize':
                    case 'text':
                    case 'w-resize':
                    case 'wait':
                    case 'inherit':
                        break;
                    default:
                        image = 'url("' + image + '"), auto'
                }
            }
            this.input.data.pointer.image = this.input.store.pointer.image = this.input.options.cursor = image;
            window.document.body.style.cursor = this.input.data.pointer.image;
            return this;
        };

        this.toggleCursor = function (toggle) {
            if (this.input.data.image !== 'none' && (toggle === undefined || toggle === false)) {
                this.input.store.pointer.image = window.document.body.style.cursor;
                window.document.body.style.cursor = 'none';
            } else {
                window.document.body.style.cursor = this.input.store.pointer.image;
            }
            return this;
        };

        this.isPointerVisible = function () {
            return this.input.data.pointer.image === 'none';
        };

        this.getPointerPosition = function () {
            if (this.data.pointer === undefined) return [0, 0];
            return [this.data.pointer.x, this.data.pointer.y];
        };

        this.getPointerMoveDistance = function () {
            if (this.data.pointer === undefined) return 0;
            return this.data.pointer.distance;
        };
    };

    Pointer.prototype = Object.create(Device.prototype);
    Pointer.prototype.constructor = Pointer;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Pointer = Pointer;
    if (global.j2d !== undefined) global.j2d.io.devices.Pointer = Pointer;
    return Pointer;
}));
