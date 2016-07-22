/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('states/BaseGameState', ['utils/ObjectUtil', 'utils/ArrayMap', 'utils/Events', 'utils/UUID'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/ObjectUtil'), require('utils/ArrayMap'), require('utils/Events'), require('utils/UUID'));
    } else {
        factory(root.j2d.utils.ObjectUtil, root.j2d.utils.ArrayMap, root.j2d.utils.Events, root.j2d.utils.UUID);
    }
}(typeof window !== 'undefined' ? window : global, function (ObjectUtil, ArrayMap, Events, UUID) {
    "use strict";

    /**
     * Base class of state
     *
     * @class BaseGameState
     * @abstract
     * @constructor
     *
     * @param {GameStatesManager} gsm
     * @param {BaseGameState.defaults|Object} [data]
     * @property {BaseGameState.defaults|Object} data
     * @property {string} id
     */
    var BaseGameState = function (gsm, data) {
        var state = this;
        if (data === undefined) data = {};
        if (data === undefined) data = {};
        data.currentState = 0;
        if (data.id === undefined || data.id === null) {
            data.id = UUID.generate();
        }
        state.data = ObjectUtil.extend(true, {}, BaseGameState.defaults, data);

        state.gsm = gsm;
        state.loader = null;
        state.events = new Events();

        Object.defineProperty(this, 'id', {
            get: function () {
                return state.data.id;
            },
            set: function (value) {
                state.data.id = value;
            }
        });
    };

    BaseGameState.defaults = {
        id: 'BaseState',
        currentState: 0
    };

    BaseGameState.STATE = {
        STATE_NOT_LOADED: 0,
        STATE_INIT: 1,
        STATE_LOAD: 2,
        STATE_UPDATE: 3,
        STATE_RENDER: 4,
        STATE_UNLOAD: 5
    };

    BaseGameState.prototype.init = function (data) {
        if (typeof data === 'object' && data.callback !== undefined) {
            data.callback();
        }
        return true;
    };
    BaseGameState.prototype.load = function (data) {
        if (typeof data === 'object' && data.callback !== undefined) data.callback();
        return true;
    };
    BaseGameState.prototype.update = function (timestamp, data) {
        return true;
    };
    BaseGameState.prototype.render = function (timestamp, data) {
        return true;
    };
    BaseGameState.prototype.unload = function (data) {
        if (typeof data === 'object' && data.callback !== undefined) data.callback();
        return true;
    };


    /* Events wrappers */
    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    BaseGameState.prototype.on = function (event, callback) {
        return this.events.on(event, callback);
    };

    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    BaseGameState.prototype.off = function (event, callback) {
        return this.events.off(event, callback);
    };

    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    BaseGameState.prototype.once = function (event, callback) {
        return this.events.once(event, callback);
    };

    /**
     * @param {string} event
     * @returns {boolean}
     */
    BaseGameState.prototype.flush = function (event) {
        return this.events.flush(event);
    };

    /**
     * @param {string} event
     * @param {Array.<*>} data
     * @returns {boolean}
     */
    BaseGameState.prototype.trigger = function (event, data) {
        return this.events.trigger(event, data);
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.BaseGameState = BaseGameState;
    if (global.j2d !== undefined) global.j2d.states.BaseGameState = BaseGameState;
    return BaseGameState;
}));
