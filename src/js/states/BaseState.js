/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('states/BaseState', ['jquery', 'utils/ArrayMap', 'utils/Events', 'utils/UUID'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('utils/ArrayMap'), require('utils/Events'), require('utils/UUID'));
    } else {
        factory(root.jQuery, root.j2d.utils.ArrayMap, root.j2d.utils.Events, root.j2d.utils.UUID);
    }
}(typeof window !== 'undefined' ? window : global, function ($, ArrayMap, Events, UUID) {
    "use strict";

    /**
     * Base class of state
     *
     * @class BaseState
     * @abstract
     * @constructor
     *
     * @param {BaseState.defaults|Object} [data]
     * @property {BaseState.defaults|Object} data
     */
    var BaseState = function (data) {
        var state = this;
        if (data === undefined) data = {};
        if (data === undefined) data = {};
        data.currentState = 0;
        if (data.id === undefined || data.id === null) {
            data.id = UUID.generate();
        }
        state.data = $.extend(true, {}, BaseState.defaults, data);

        state.events = new Events();
    };

    BaseState.defaults = {
        id: 'BaseState',
        currentState: 0
    };

    BaseState.STATE = {
        STATE_NOT_LOADED: 0,
        STATE_INIT: 1,
        STATE_LOAD: 2,
        STATE_UPDATE: 3,
        STATE_RENDER: 4,
        STATE_UNLOAD: 5
    };

    BaseState.prototype.init = function (callback) {
        if (callback !== undefined) callback();
        return true;
    };
    BaseState.prototype.load = function (callback) {
        if (callback !== undefined) callback();
        return true;
    };
    BaseState.prototype.update = function (timestamp, data) {
        return true;
    };
    BaseState.prototype.render = function (timestamp, data) {
        return true;
    };
    BaseState.prototype.unload = function (callback) {
        if (callback !== undefined) callback();
        return true;
    };


    /* Events wrappers */
    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    BaseState.prototype.on = function (event, callback) {
        return this.events.on(event, callback);
    };

    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    BaseState.prototype.off = function (event, callback) {
        return this.events.off(event, callback);
    };

    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    BaseState.prototype.once = function (event, callback) {
        return this.events.once(event, callback);
    };

    /**
     * @param {string} event
     * @returns {boolean}
     */
    BaseState.prototype.flush = function (event) {
        return this.events.flush(event);
    };

    /**
     * @param {string} event
     * @param {Array.<*>} data
     * @returns {boolean}
     */
    BaseState.prototype.trigger = function (event, data) {
        return this.events.trigger(event, data);
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.BaseState = BaseState;
    if (global.j2d === undefined) global.j2d.states.BaseState = BaseState;
    return BaseState;
}));
