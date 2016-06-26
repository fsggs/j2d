/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('states/GameStatesManager', [
            'jquery',
            'utils/ArrayMap',
            'states/DefaultGameState',
            'states/BaseGameState'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('utils/ArrayMap'),
            require('states/DefaultGameState'),
            require('states/BaseGameState')
        );
    } else {
        factory(
            root.jQuery,
            root.j2d.utils.ArrayMap,
            root.j2d.states.DefaultGameState,
            root.j2d.states.BaseGameState
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, ArrayMap, DefaultGameState, BaseGameState) {
    "use strict";

    /**
     * Game states Manager
     *
     * @class GameStatesManager
     * @abstract
     * @constructor
     *
     * @param {GameStatesManager.defaults|Object} data
     * @param {function} sceneCallback
     * @property {GameStatesManager.defaults|Object} data
     * @property {number} state
     */
    var GameStatesManager = function (data, sceneCallback) {
        var stateManager = this;
        stateManager.data = $.extend(true, {}, GameStatesManager.defaults, data);
        stateManager.add(new DefaultGameState());
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
     * @type {{previousState: number, currentState: number, states: ArrayMap<BaseGameState>}}
     */
    GameStatesManager.defaults = {
        previousState: null,
        currentState: 0,
        states: new ArrayMap()
    };

    /**
     * @param {string} [id]
     * @returns {BaseGameState|null}
     */
    GameStatesManager.prototype.getState = function (id) {
        if (id === undefined) return this.getCurrent();
        if (this.data.states.contains(id)) {
            return this.data.states[id];
        }
        return null
    };

    GameStatesManager.prototype.getPreviousState = function () {
        return this.data.states.get(this.data.states[this.data.previousState]);
    };

    GameStatesManager.prototype.getNextState = function () {
        if (this.data.states[this.state + 1] !== undefined) {
            return this.data.states.get(this.data.states[this.state + 1]);
        }
        return null;
    };

    GameStatesManager.prototype.getCurrent = function () {
        return this.data.states.get(this.data.states[this.data.currentState]);
    };

    /**
     * @param {string} id
     */
    GameStatesManager.prototype.setState = function (id) {
        if (this.data.states.contains(id)) {
            this.data.previousState = this.data.currentState;
            this.data.currentState = this.data.states.indexOf(id);
            this.sceneCallback(id);
        }

        return this;
    };

    GameStatesManager.prototype.setNextState = function () {
        if (this.data.states[this.state + 1] !== undefined) {
            this.data.previousState = this.data.currentState;
            this.data.currentState = this.state + 1;
            this.sceneCallback(this.data.states[this.state]);
        }

        return this;
    };

    GameStatesManager.prototype.setPreviousState = function () {
        if (this.data.states[this.data.previousState] !== undefined) {
            var state = this.data.previousState;
            this.data.previousState = this.data.currentState;
            this.data.currentState = state;
            this.sceneCallback(this.data.states[state]);
        }

        return this;
    };

    /**
     * @param {BaseGameState} state
     * @param {string} [id]
     */
    GameStatesManager.prototype.add = function (state, id) {
        if (id === undefined) id = state.data.id;
        if (!this.data.states.contains(id) && state instanceof BaseGameState) {
            this.data.states.add(id, state);
        }
        return this;
    };

    /**
     * @param {string} id
     */
    GameStatesManager.prototype.remove = function (id) {
        if (this.data.states.contains(id)) {
            this.data.states.remove(id);
        }
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.GameStatesManager = GameStatesManager;
    if (global.j2d === undefined) global.j2d.states.GameStatesManager = GameStatesManager;
    return GameStatesManager;
}));
