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
        define('api/Handler', ['api/PrototypeObject', 'api/interfaces/IHandler'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/PrototypeObject'), require('api/interfaces/IHandler'));
    } else {
        factory(root.j2d.api.PrototypeObject, root.j2d.api.interfaces.IHandler);
    }
}(typeof window !== 'undefined' ? window : global, function (PrototypeObject, IHandler) {
    "use strict";

    /**
     * Handler
     * @constructor
     */
    var Handler = function () {
        PrototypeObject.call(this);

        this.events = null;
        this.isEnabled = false;
    };

    Handler.interfaces = [IHandler];

    Handler.prototype = Object.create(PrototypeObject.prototype);
    Handler.prototype.constructor = Handler;

    Handler.prototype.init = function (eventHandler) {
        if (eventHandler !== undefined) {
            this.events = eventHandler;
        }
        return this;
    };

    Handler.prototype.enable = function () {
        this.isEnabled = true;
        return this;
    };

    Handler.prototype.disable = function () {
        this.isEnabled = false;
        return this;
    };

    Handler.prototype.toggle = function (status) {
        if (status === undefined) status = !this.isEnabled;
        if (status) {
            this.enable();
        } else {
            this.disable();
        }
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Handler = Handler;
    if (global.j2d !== undefined) global.j2d.api.Handler = Handler;
    return Handler;
}));
