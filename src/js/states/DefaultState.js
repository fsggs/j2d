/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('states/DefaultState', ['states/BaseState'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('states/BaseState'));
    } else {
        factory(root.j2d.states.BaseState);
    }
}(typeof window !== 'undefined' ? window : global, function (BaseState) {
    "use strict";

    /**
     * Default state
     *
     * @class DefaultState
     * @abstract
     * @constructor
     *
     * @param {DefaultState.defaults|BaseState.defaults|Object} [data]
     * @property {DefaultState.defaults|BaseState.defaults|Object} data
     */
    var DefaultState = function (data) {
        if (data === undefined) data = {};
        data.id = 'initJ2D';
        BaseState.call(this, data);
    };

    DefaultState.prototype = Object.create(BaseState.prototype);
    DefaultState.prototype.constructor = DefaultState;

    // DefaultState.prototype.init = function (callback) {
    //     if (callback !== undefined) callback();
    //     return true;
    // };
    // DefaultState.prototype.load = function (callback) {
    //     if (callback !== undefined) callback();
    //     return true;
    // };
    // DefaultState.prototype.update = function (timestamp, data) {
    //     return true;
    // };
    // DefaultState.prototype.render = function (timestamp, data) {
    //     return true;
    // };
    // DefaultState.prototype.unload = function (callback) {
    //     if (callback !== undefined) callback();
    //     return true;
    // };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.DefaultState = DefaultState;
    if (global.j2d === undefined) global.j2d.states.DefaultState = DefaultState;
    return DefaultState;
}));
