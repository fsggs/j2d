/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('states/DefaultGameState', ['states/BaseGameState'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('states/BaseGameState'));
    } else {
        factory(root.j2d.states.BaseGameState);
    }
}(typeof window !== 'undefined' ? window : global, function (BaseGameState) {
    "use strict";

    /**
     * Default game state
     *
     * @class DefaultGameState
     * @abstract
     * @constructor
     *
     * @param {GameStatesManager} gsm
     * @param {DefaultGameState.defaults|BaseGameState.defaults|Object} [data]
     * @property {DefaultGameState.defaults|BaseGameState.defaults|Object} data
     */
    var DefaultGameState = function (gsm, data) {
        if (data === undefined) data = {};
        data.id = 'init_j2d';
        BaseGameState.call(this, gsm, data);
    };

    DefaultGameState.prototype = Object.create(BaseGameState.prototype);
    DefaultGameState.prototype.constructor = DefaultGameState;

    // DefaultGameState.prototype.init = function (data) {
    //     return BaseGameState.prototype.init.call(this, data);
    // };
    // DefaultGameState.prototype.load = function (data) {
    //     return BaseGameState.prototype.load.call(this, data);
    // };
    DefaultGameState.prototype.update = function (timestamp, data) {
        setTimeout(function () {
            this.gsm.setNextState();
        }.bind(this), 1000);
        return true;
    };
    // DefaultGameState.prototype.render = function (timestamp, data) {
    //     return true;
    // };
    // DefaultGameState.prototype.unload = function (data) {
    //     return BaseGameState.prototype.unload.call(this, data);
    // };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.DefaultGameState = DefaultGameState;
    if (global.j2d !== undefined) global.j2d.states.DefaultGameState = DefaultGameState;
    return DefaultGameState;
}));
