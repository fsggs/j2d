/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('states/StatesManager', [
            'jquery',
            'utils/ArrayMap',
            'states/DefaultState',
            'states/BaseState'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('utils/ArrayMap'),
            require('states/DefaultState'),
            require('states/BaseState')
        );
    } else {
        factory(
            root.jQuery,
            root.j2d.utils.ArrayMap,
            root.j2d.states.DefaultState,
            root.j2d.states.BaseState
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, ArrayMap, DefaultState, BaseState) {
    "use strict";

    /**
     * States Manager
     *
     * @class StatesManager
     * @abstract
     * @constructor
     *
     * @param {StatesManager.defaults|Object} data
     * @param {function} sceneCallback
     * @property {StatesManager.defaults|Object} data
     * @property {number} state
     */
    var StatesManager = function (data, sceneCallback) {
        var stateManager = this;
        stateManager.data = $.extend(true, {}, StatesManager.defaults, data);
        stateManager.add(new DefaultState());
        stateManager.sceneCallback = sceneCallback;

        Object.defineProperty(this, 'state', {
            get: function () {
                return stateManager.data.currentState;
            },
            set: function (value) {
                stateManager.data.currentState = value;
                
            }
        });
    };

    /**
     * @type {{previousState: number, currentState: number, states: ArrayMap<BaseState>}}
     */
    StatesManager.defaults = {
        previousState: null,
        currentState: 0,
        states: new ArrayMap()
    };

    /**
     * @param {string} [id]
     * @returns {BaseState|null}
     */
    StatesManager.prototype.getState = function (id) {
        if (id === undefined) id = this.state; // TODO:: fix bug
        if (this.data.states.contains(id)) {
            return this.data.states[id];
        }
        return null
    };

    StatesManager.prototype.getPreviousState = function () {
        return this.data.states.get(this.data.states[this.data.previousState]);
    };

    StatesManager.prototype.getCurrent = function () {
        return this.data.states.get(this.data.states[this.data.currentState]);
    };

    /**
     * @param {string} id
     */
    StatesManager.prototype.setState = function (id) {
        if (this.data.states.contains(id)) {
            this.data.previousState = this.data.currentState;
            this.data.currentState = this.data.states.indexOf(id);
            this.sceneCallback(id);
        }

        return this;
    };

    /**
     * @param {BaseState} state
     * @param {string} [id]
     */
    StatesManager.prototype.add = function (state, id) {
        if (id === undefined) id = state.data.id;
        if (!this.data.states.contains(id) && state instanceof BaseState) {
            this.data.states.add(id, state);
        }
        return this;
    };

    /**
     * @param {string} id
     */
    StatesManager.prototype.remove = function (id) {
        if (this.data.states.contains(id)) {
            this.data.states.remove(id);
        }
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.StatesManager = StatesManager;
    if (global.j2d === undefined) global.j2d.states.StatesManager = StatesManager;
    return StatesManager;
}));
