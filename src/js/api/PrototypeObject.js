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
        define('api/PrototypeObject', ['api/PrototypeInterface'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/PrototypeInterface'));
    } else {
        factory(root.j2d.api.PrototypeInterface);
    }
}(typeof window !== 'undefined' ? window : global, function (PrototypeInterface) {
    "use strict";

    /**
     * PrototypeObject
     * @constructor
     */
    var PrototypeObject = function () {
        if (this.constructor.interfaces === undefined) this.constructor.interfaces = [];

        var scope = [];

        /**
         TODO:: Object.getPrototypeOf(obj),
         @link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
         */
        var implement = function (object) {
            if (object.__proto__.constructor.name === 'Object'
                || object.__proto__.constructor === undefined
                || object.__proto__.constructor.interfaces.length < 1
            ) return;

            for (var i = 0; i < object.__proto__.constructor.interfaces.length; i++) {
                if (!scope.includes(object.__proto__.constructor.interfaces[i].name)) {
                    scope.push(object.__proto__.constructor.interfaces[i].name);
                    this.constructor.interfaces.push(object.__proto__.constructor.interfaces[i]);
                }
            }

            implement(object.__proto__);
        }.bind(this);

        implement(this.__proto__);
    };

    PrototypeObject.prototype.instanceOf = function (interfaces) {
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
                    // } else if (typeof interfaces[i] === 'object') {
                    //     if (!(this instanceof interfaces[i].constructor)) return false;
                } else if (typeof interfaces[i] === 'function') {
                    if (!(this instanceof interfaces[i])) return false;
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
            // } else if (typeof interfaces === 'object') {
            //     if (!(this instanceof interfaces.constructor)) return false;
        } else if (typeof interfaces === 'function') {
            if (!(this instanceof interfaces)) return false;
        } else {
            throw new Error('Error. "' + interfaces.constructor.name + '" is not interface!');
        }
        return true;
    };

    PrototypeObject.prototype.toString = function () {
        return this.__proto__.constructor.name;
    };

    PrototypeObject.interfaces = [];

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.PrototypeObject = PrototypeObject;
    if (global.j2d !== undefined) global.j2d.api.PrototypeObject = PrototypeObject;
    return PrototypeObject;
}));
