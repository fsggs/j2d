/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('transitions/Tween', [
            'jquery',
            'nodes/BaseNode',
            'utils/Events',
            'transitions/utils/Easing',
            'transitions/utils/Interpolation'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('nodes/BaseNode'),
            require('utils/Events'),
            require('transitions/utils/Easing'),
            require('transitions/utils/Interpolation')
        );
    } else {
        factory(
            root.jQuery,
            root.j2d.nodes.BaseNode,
            root.j2d.utils.Events,
            root.j2d.transitions.utils.Easing,
            root.j2d.transitions.utils.Interpolation
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, BaseNode, Events, Easing, Interpolation) {
    "use strict";

    var tweens = [];

    /**
     * @class Tween
     * @exports module:transitions/Tween
     *
     * @constructor
     * @param {BaseNode|{data: object}} tweenNode
     * @param {Tween.defaults|Object} [data]
     * @property {Tween.defaults} data
     */
    var Tween = function (tweenNode, data) {
        var tween = this;
        tween.data = $.extend(true, {}, Tween.defaults, data);
        tween.node = tweenNode;
        tween.events = new Events();

        // TODO:: Exceptions
        // if (!(node instanceof BaseNode) || typeof node.data !== 'object') {
        //     throw new InvalidArgumentException('Unknown tween node');
        // }
    };

    Tween.defaults = {
        currentStateAnimation: 0,
        tweenStateStack: [],
        chainedTweensStack: [],

        isAnimated: false,
        isStarted: false,
        startTime: null,

        delayTime: 0,
        repeatCount: 0,
        yoyoCount: 0,

        delayAllTime: 0,
        repeatAllCount: 0,
        yoyoAllCount: 0,

        defaultDuration: 1000
    };

    Tween.stateDefaults = {
        startData: null,
        endData: null,

        duration: 1000,
        easing: 'linear',
        interpolation: 'linear'
    };

    /**
     * @param {Tween.defaults|Object} data
     * @returns {{count: number, duration: number, easing: string, interpolation: string}}
     */
    var tweenStateData = function (data) {
        return (data !== undefined && typeof data === 'object')
            ? $.extend(true, {}, Tween.stateDefaults, data)
            : Tween.stateDefaults;
    };

    /* Methods */
    /**
     * @param properties
     * @param {Tween.defaults|Object} data
     * @returns {Tween}
     */
    Tween.prototype.to = function (properties, data) {
        var tween = this;

        var stateData = tweenStateData(data);
        if (data !== undefined && typeof data === 'number') stateData.duration = data;

        tween.data.tweenStateStack.push([properties, stateData]);

        return tween;
    };

    /**
     * @param {number} time
     * @returns {Tween}
     */
    Tween.prototype.update = function (time) {
        var tween = this;

        console.log(this.data);

        //debugger;
        return tween;
    };

    /**
     * @param {number} time
     * @returns {Tween}
     */
    Tween.prototype.start = function (time) {
        var tween = this;
        if (time === undefined) time = global.performance.now();
        tween.data.isAnimated = true;
        tween.data.isStarted = true; // TODO:: is need?
        tween.data.startTime = time + tween.data.delayTime;

        var startState = tween.data.tweenStateStack[tween.data.currentStateAnimation][1]
            || $.extend(true, {}, Tween.stateDefaults, this.node.data);

        return Tween.add(tween);
    };

    /**
     * @returns {Tween}
     */
    Tween.prototype.stop = function () {
        var tween = this;
        if (!tween.data.isAnimated) return this;

        tween.data.isAnimated = false;
        tween.events.trigger('stop', [tween.node]);
        tween.stopChainedTweens();

        return Tween.remove(tween);
    };

    /**
     * @returns {Tween}
     */
    Tween.prototype.stopChainedTweens = function () {
        var tween = this;
        for (i = 0; i < tween.data.chainedTweensStack.length; i++) {
            tween.data.chainedTweensStack[i].stop();
        }

        return tween;
    };


    /* Extended animation methods */
    /**
     * @param {number} data
     * @returns {Tween}
     */
    Tween.prototype.delay = function (data) {
        this.to('delay', data);
        return this;
    };

    /**
     * @param {number} data
     * @returns {Tween}
     */
    Tween.prototype.delayAll = function (data) {
        this.to('delayAll', data);
        return this;
    };

    /**
     * @param {number} data
     * @returns {Tween}
     */
    Tween.prototype.repeat = function (data) {
        this.to('repeat', data);
        return this;
    };

    /**
     * @param {number} data
     * @returns {Tween}
     */
    Tween.prototype.repeatAll = function (data) {
        this.to('repeatAll', data);
        return this;
    };

    /**
     * @param {number} data
     * @returns {Tween}
     */
    Tween.prototype.yoyo = function (data) {
        this.to('yoyo', data);
        return this;
    };

    /**
     * @param {number} data
     * @returns {Tween}
     */
    Tween.prototype.yoyoAll = function (data) {
        this.to('yoyoAll', data);
        return this;
    };


    /* Events wrappers */
    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    Tween.prototype.on = function (event, callback) {
        return this.events.on(event, callback);
    };

    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    Tween.prototype.off = function (event, callback) {
        return this.events.off(event, callback);
    };

    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    Tween.prototype.once = function (event, callback) {
        return this.events.once(event, callback);
    };

    /**
     * @param {string} event
     * @returns {boolean}
     */
    Tween.prototype.flush = function (event) {
        return this.events.flush(event);
    };

    /**
     * @param {string} event
     * @param {Array.<*>} data
     * @returns {boolean}
     */
    Tween.prototype.trigger = function (event, data) {
        return this.events.trigger(event, data);
    };


    /* Static Methods */
    /**
     * @param {number} index
     * @returns {Array.<Tween>|Tween}
     */
    Tween.get = function (index) {
        return (index === undefined) ? tweens : tweens[index];
    };

    /**
     * @param {Tween} tween
     * @returns {Tween}
     */
    Tween.add = function (tween) {
        tweens.push(tween);
        return tween;
    };

    /**
     * @param {Tween} tween
     * @returns {Tween}
     */
    Tween.remove = function (tween) {
        var i = tweens.indexOf(tween);
        if (i !== -1) tweens.splice(i, 1);
        return tween;
    };

    /**
     * @returns {void}
     */
    Tween.flush = function () {
        tweens = [];
    };

    /**
     * @param {number} time
     * @returns {boolean}
     */
    Tween.update = function (time) {
        if (tweens.length === 0) return false;

        var i = 0;

        while (i < tweens.length) {
            if (tweens[i].update(time)) {
                i++;
            } else {
                tweens.splice(i, 1);
            }
        }
        return true;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Tween = Tween;
    if (global.j2d === undefined) global.j2d.transitions.Tween = Tween;
    return Tween;
}));
