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

        defaultDuration: 1000
    };

    Tween.stateDefaults = {
        count: 0,
        duration: 1000,
        easing: 'linear',
        interpolation: 'linear'
    };

    var tweenStateData = function (data) {
        return (data !== undefined && typeof data === 'object')
            ? $.extend(true, {}, Tween.stateDefaults, data)
            : Tween.stateDefaults;
    };

    /* Methods */
    Tween.prototype.to = function (properties, data) {
        var tween = this;

        var stateData = tweenStateData(data);
        if (data !== undefined && typeof data === 'number') stateData.duration = data;

        tween.data.tweenStateStack.push([properties, stateData]);

        return tween;
    };

    Tween.prototype.start = function (time) {
        var tween = this;
        if (time === undefined) time = global.performance.now();
        tween.data.isAnimated = true;
        tween.data.isStarted = true; // TODO:: is need?
        tween.data.startTime = time + tween.data.delayTime;

        return Tween.add(tween);
    };

    Tween.prototype.stop = function () {
        var tween = this;
        if (!tween.data.isAnimated) return this;

        tween.data.isAnimated = false;
        tween.events.trigger('stop', [tween.node]);
        tween.stopChainedTweens();

        return Tween.remove(tween);
    };

    Tween.prototype.stopChainedTweens = function () {
        var tween = this;
        for (i = 0; i < tween.data.chainedTweensStack.length; i++) {
            tween.data.chainedTweensStack[i].stop();
        }

        return tween;
    };

    Tween.prototype.update = function (time) {
        var tween = this;

        return tween;
    };


    /* Extended animation methods */
    Tween.prototype.delay = function (data) {
        this.to('delay', data);
        return this;
    };

    Tween.prototype.delayAll = function (data) {
        this.to('delayAll', data);
        return this;
    };

    Tween.prototype.repeat = function (data) {
        this.to('repeat', data);
        return this;
    };

    Tween.prototype.repeatAll = function (data) {
        this.to('repeatAll', data);
        return this;
    };

    Tween.prototype.yoyo = function (data) {
        this.to('yoyo', data);
        return this;
    };

    Tween.prototype.yoyoAll = function (data) {
        this.to('yoyoAll', data);
        return this;
    };


    /* Events wrappers */
    Tween.prototype.on = function (event, callback) {
        return this.events.on(event, callback);
    };

    Tween.prototype.off = function (event, callback) {
        return this.events.off(event, callback);
    };

    Tween.prototype.once = function (event, callback) {
        return this.events.once(event, callback);
    };

    Tween.prototype.flush = function (event) {
        return this.events.flush(event);
    };

    Tween.prototype.trigger = function (event, data) {
        return this.events.trigger(event, data);
    };


    /* Static Methods */
    Tween.get = function (index) {
        return (index === undefined) ? tweens : tweens[index];
    };

    Tween.add = function (tween) {
        tweens.push(tween);
        return tween;
    };

    Tween.remove = function (tween) {
        var i = tweens.indexOf(tween);
        if (i !== -1) tweens.splice(i, 1);
        return tween;
    };

    Tween.flush = function () {
        tweens = [];
    };

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
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Tween = Tween;
    if (global.j2d === undefined) global.j2d.transitions.Tween = Tween;
    return Tween;
}));
