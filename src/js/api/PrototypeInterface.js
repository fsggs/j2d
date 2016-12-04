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
        define('api/PrototypeInterface', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     * PrototypeInterface
     * @constructor
     */
    var PrototypeInterface = function () {
    };

    PrototypeInterface.implements = [PrototypeInterface];

    PrototypeInterface.prototype.instanceOf = function (interfaces) {
        var i = 0, j = 0;
        if (typeof interfaces === 'object' && interfaces instanceof Array) {
            for (i = 0; i < interfaces.length; i++) {
                // if (typeof interfaces[i] === 'object' && interfaces[i] instanceof PrototypeInterface) {
                //     for (j = 0; j < this.constructor.interfaces.length; j++) {
                //         if (!(new (this.constructor.interfaces[j]) instanceof interfaces[i].constructor)) return false;
                //     }
                // } else
                if (typeof interfaces[i] === 'function' && new (interfaces[i]) instanceof PrototypeInterface) {
                    for (j = 0; j < this.constructor.interfaces.length; j++) {
                        if (!(new (this.constructor.interfaces[j]) instanceof interfaces[i])) return false;
                    }
                } else throw new Error('Error. "' + interfaces[i].constructor.name + '" is not interface!');
            }
        } else if (
            //(typeof interfaces === 'object' && interfaces instanceof PrototypeInterface) ||
            (typeof interfaces === 'function' && new (interfaces) instanceof PrototypeInterface)
        ) {
            //if (typeof interfaces === 'object') interfaces = interfaces.constructor;
            for (i = 0; i < this.constructor.interfaces.length; i++) {
                if (!(new (this.constructor.interfaces[i]) instanceof interfaces)) return false;
            }
        } else {
            throw new Error('Error. "' + interfaces.constructor.name + '" is not interface!');
        }
        return true;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.PrototypeInterface = PrototypeInterface;
    if (global.j2d !== undefined) global.j2d.api.PrototypeInterface = PrototypeInterface;
    return PrototypeInterface;
}));
