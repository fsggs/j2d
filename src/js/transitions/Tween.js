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

        tween.state = {};

        // TODO:: Exceptions
        // if (!(node instanceof BaseNode) || typeof node.data !== 'object') {
        //     throw new InvalidArgumentException('Unknown tween node');
        // }
    };

    Tween.defaults = {
        currentStateAnimation: 0,
        tweenStateStack: [],
        tweenStateTimings: [],
        chainedTweensStack: [],

        isAnimated: false,
        isStarted: false,
        startTime: null,

        delayTime: 0,

        defaultDuration: 1000
    };

    //TODO:: rename data to value
    Tween.stateDefaults = {
        data: null,
        duration: 1000,
        delay: 0,
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
     * @param {Object} properties
     * @param {Tween.defaults|Object} data
     * @returns {Tween}
     */
    Tween.prototype.to = function (properties, data) {
        var tween = this;

        if (!tween.data.isStarted) {

            if (typeof data === 'number') data = {data: data};
            var stateData = (typeof data !== 'number') ? tweenStateData(data) : data;
            if (data !== undefined && typeof data === 'number') stateData.duration = data;

            tween.data.tweenStateStack.push([properties, stateData]);

            return tween;
        }

        // TODO:: Exceptions
        // throw new RuntimeException('You can not add a state after the start of the tween.');
    };

    /**
     * @param {number} time
     * @returns {boolean}
     */
    Tween.prototype.update = function (time) {
        var tween = this;

        var nextState = tween.data.tweenStateStack[tween.data.currentStateAnimation + 1];

        if (time < tween.data.startTime || nextState === undefined) return true;

        if (!tween.data.isStarted) {
            tween.events.trigger('start', [tween.node]);
            tween.data.isStarted = true;
        }

        var currentState = tween.data.tweenStateStack[tween.data.currentStateAnimation];

        var previousStatesTime = tween.getStateTimeDuration(tween.data.currentStateAnimation, true);

        var elapsed = (time - (tween.data.startTime + previousStatesTime)) / nextState[1].duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        tween.node.import(
            Tween.util.animateTween(currentState[0], nextState[0], Easing.get(nextState[1].easing)(elapsed))
        );

        tween.events.trigger('update', [tween.node]);

        if (elapsed === 1) {
            if (tween.data.currentStateAnimation < tween.data.tweenStateStack.length) {
                tween.data.currentStateAnimation++;
            } else {
                tween.events.trigger('complete', [tween.node]);

                for (var i = 0; i < tween.data.chainedTweensStack.length; i++) {
                    tween.data.chainedTweensStack[i].start(tween.data.startTime); //TODO: add tweenStackTime
                }
                return false;
            }
        }
        return true;
    };


    var calculateStackStateTimings = function (tweenStateStack) {
        var result = [];

        tweenStateStack.forEach(function (value) {
            result.push(value[1].duration);
        });

        return result;
    };

    /**
     * @param {number} [position]
     * @param {boolean} [withPrevious]
     *
     * @returns {number}
     */
    Tween.prototype.getStateTimeDuration = function (position, withPrevious) {
        if (position === undefined || position === null) position = this.data.currentStateAnimation;
        if (withPrevious === undefined) withPrevious = false;

        if (this.data.tweenStateTimings[position] === undefined) return 0;

        if (withPrevious) {
            var result = 0;
            for (var i = 1; i <= position; i++) {
                result += this.data.tweenStateTimings[i];
            }
            return result;
        } else {
            return this.data.tweenStateTimings[position];
        }
    };

    /**
     * TODO:: add delay parse to others states
     * @param {Array.<Object, Tween.stateDefaults>} startState
     * @param {Array.<Array<Object, Tween.stateDefaults>>} tweenStateStack
     */
    var calculateStackState = function (startState, tweenStateStack) {
        var result = [startState];
        var index = 1;

        var parsedTweenStateStack = [startState];
        var nextStateDelay = 0;
        var nextAllStateDelay = 0;

        tweenStateStack.forEach(function (value) {
            if (typeof value[0] === 'object' && !(value[0] instanceof Array)) {
                if (nextStateDelay !== 0) {
                    value[1].delay = nextStateDelay;
                    nextStateDelay = 0;
                } else if (nextAllStateDelay !== 0) {
                    value[1].delay = nextAllStateDelay;
                }
                parsedTweenStateStack.push([value[0], value[1]]);
                index++;
            } else if (typeof value[0] === 'string') {
                var i = 0;
                switch (value[0]) {
                    case 'delay':
                        nextStateDelay = value[1].data;
                        break;
                    case 'delayAll':
                        nextAllStateDelay = value[1].data;
                        break;
                    case 'repeat':
                        for (i = 0; i < value[1].data; i++) {
                            parsedTweenStateStack.push(parsedTweenStateStack[index]);
                            index++;
                        }
                        break;
                    case 'repeatAll':
                        for (i = 0; i < value[1].data; i++) {
                            parsedTweenStateStack.concat(parsedTweenStateStack);
                            index++;
                        }
                        break;
                    case 'yoyo':
                    case 'reverse':
                        for (i = 0; i < value[1].data; i++) {
                            if (parsedTweenStateStack[index - 1] !== undefined) {
                                parsedTweenStateStack.push([
                                    Tween.util.reverseProperties(parsedTweenStateStack[index - 1][0]),
                                    parsedTweenStateStack[index - 1][1]
                                ]);
                                index++;
                            }
                        }
                        break;
                    case 'yoyoAll':
                    case 'reverseAll':
                        for (i = 0; i < value[1].data; i++) {
                            var stateStack = parsedTweenStateStack.slice(0);

                            var stackLength = stateStack.length;
                            for (var j = 0; j < stackLength; j++) {
                                var sIndex = stackLength - j - 1;
                                if (stateStack[sIndex] !== undefined) {
                                    parsedTweenStateStack.push([
                                        Tween.util.reverseProperties(stateStack[sIndex][0]),
                                        stateStack[sIndex][1]
                                    ]);
                                    index++;
                                }
                            }
                        }
                        break;
                }
            }
        });

        // parsedTweenStateStack.forEach(function (value) {
        //     console.info(value[0].position.x);
        // });

        index = 0;
        parsedTweenStateStack.shift();
        parsedTweenStateStack.forEach(function (value) {
            if (typeof value[0] === 'object' && !(value[0] instanceof Array)) {
                result.push([Tween.util.calculateProperties(result[index][0], $.extend(true, {}, result[index][0], value[0])), value[1]]);
                index++;
            }
        });

        return result;
    };

    /**
     * @param {number} time
     * @returns {Tween}
     */
    Tween.prototype.start = function (time) {
        var tween = this;
        if (time === undefined) time = global.performance.now();
        tween.data.isAnimated = true;

        if (!tween.data.isStarted) {
            tween.data.isStarted = true;
            tween.state = [Tween.util.cleanProperties(tween.node.data), Tween.stateDefaults];
            tween.data.tweenStateStack = calculateStackState(tween.state, tween.data.tweenStateStack);
            tween.data.tweenStateTimings = calculateStackStateTimings(tween.data.tweenStateStack);
        }

        tween.data.startTime = time + tween.data.delayTime;

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
        for (var i = 0; i < tween.data.chainedTweensStack.length; i++) {
            tween.data.chainedTweensStack[i].stop();
        }

        return tween;
    };


    /* Extended animation methods */
    /**
     * @param {number} delay
     * @returns {Tween}
     */
    Tween.prototype.delay = function (delay) {
        if (delay === undefined) delay = 1000;
        this.to('delay', delay);
        return this;
    };

    /**
     * @param {number} delay
     * @returns {Tween}
     */
    Tween.prototype.delayAll = function (delay) {
        if (delay === undefined) delay = 1000;
        this.to('delayAll', delay);
        return this;
    };

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    Tween.prototype.repeat = function (count) {
        if (count === undefined) count = 1;
        this.to('repeat', count);
        return this;
    };

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    Tween.prototype.repeatAll = function (count) {
        if (count === undefined) count = 1;
        this.to('repeatAll', count);
        return this;
    };

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    Tween.prototype.yoyo = function (count) {
        if (count === undefined) count = 1;
        this.to('yoyo', count);
        return this;
    };

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    Tween.prototype.yoyoAll = function (count) {
        if (count === undefined) count = 1;
        this.to('yoyoAll', count);
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

    Tween.util = {
        animateTween: function (currentState, nextState, value) {
            var result = {};
            var property;
            var temp;

            for (property in nextState) {
                if (nextState.hasOwnProperty(property) && currentState.hasOwnProperty(property)) {
                    temp = null;

                    if (typeof nextState[property] === 'number') {
                        if (currentState[property] === nextState[property]) {
                            temp = currentState[property];
                        } else {
                            temp = currentState[property] + (nextState[property] - currentState[property]) * value;
                        }
                    } else if (typeof nextState[property] === 'object') {
                        temp = this.animateTween(currentState[property], nextState[property], value);
                    }
                    if (temp !== null) result[property] = temp;
                }
            }

            return Object.keys(result).length > 0 ? result : null;
        },

        cleanProperties: function (properties) {
            var result = {};
            var property;
            var temp;

            for (property in properties) {
                if (properties.hasOwnProperty(property) && property !== 'id') {
                    temp = null;
                    if ((typeof properties[property] === 'string' && !isNaN(properties[property]))
                        || typeof properties[property] === 'number'
                    ) {
                        temp = properties[property];
                    } else if (typeof properties[property] === 'object') {
                        temp = this.cleanProperties(properties[property]);
                    }
                    if (temp !== null) result[property] = temp;
                }
            }

            return Object.keys(result).length > 0 ? result : null;
        },

        reverseProperties: function (properties) {
            var result = {};
            var property;
            var temp;

            for (property in properties) {
                if (properties.hasOwnProperty(property) && property !== 'id') {
                    temp = null;
                    if (typeof properties[property] === 'string' && !isNaN(properties[property])) {
                        temp = Number(parseFloat(properties[property]) * -1).toString();
                    } else if (typeof properties[property] === 'number') {
                        temp = properties[property];
                    } else if (typeof properties[property] === 'object') {
                        temp = this.reverseProperties(properties[property]);
                    }
                    if (temp !== null) result[property] = temp;
                }
            }

            return Object.keys(result).length > 0 ? result : null;
        },

        calculateProperties: function (startProperties, endProperties) {
            var result = {};
            var property;
            var temp;

            for (property in endProperties) {
                if (endProperties.hasOwnProperty(property) && startProperties.hasOwnProperty(property) && property !== 'id') {
                    temp = null;

                    if (typeof endProperties[property] === 'string' && !isNaN(endProperties[property]) && typeof startProperties[property] === 'number') {
                        temp = startProperties[property] + parseFloat(endProperties[property]);
                    } else if (typeof endProperties[property] === 'number' && typeof startProperties[property] === 'string' && !isNaN(startProperties[property])) {
                        temp = endProperties[property] - parseFloat(startProperties[property]);
                    } else if (typeof endProperties[property] === 'number' && typeof startProperties[property] === 'number') {
                        temp = endProperties[property];
                    } else if (typeof endProperties[property] === 'object') {
                        temp = this.calculateProperties(startProperties[property], endProperties[property]);
                    }

                    if (temp !== null) result[property] = temp;
                }
            }
            return Object.keys(result).length > 0 ? result : null;
        }
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Tween = Tween;
    if (global.j2d === undefined) global.j2d.transitions.Tween = Tween;
    return Tween;
}));
