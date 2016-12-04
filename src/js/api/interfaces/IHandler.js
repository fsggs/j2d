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
        define('api/interfaces/IHandler', ['api/PrototypeInterface'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/PrototypeInterface'));
    } else {
        factory(root.j2d.api.api.PrototypeInterface);
    }
}(typeof window !== 'undefined' ? window : global, function (PrototypeInterface) {
    "use strict";

    /**
     * IHandler
     * @constructor
     */
    var IHandler = function () {
        PrototypeInterface.call(this);
    };

    IHandler.prototype = Object.create(PrototypeInterface.prototype);
    IHandler.prototype.constructor = IHandler;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.IHandler = IHandler;
    if (global.j2d !== undefined) global.j2d.api.interfaces.IHandler = IHandler;
    return IHandler;
}));
