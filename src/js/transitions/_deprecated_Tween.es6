import ObjectUtil from "utils/ObjectUtil";
import Events from "utils/Events";
import Easing from "transitions/utils/Easing";
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
export default class Tween {
    static defaults = {
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

    static stateDefaults = {
        data: null,
        duration: 1000,
        delay: 0,
        easing: 'linear',
        interpolation: 'linear'
    };

    static Easing = Easing;

    constructor(tweenNode, data) {
        this.data = ObjectUtil.extend(true, {}, Tween.defaults, data);
        this.node = tweenNode;
        this.events = new Events();

        this.state = {};

        // TODO:: Exceptions
        // if (!(node instanceof BaseNode) || typeof node.data !== 'object') {
        //     throw new InvalidArgumentException('Unknown tween node');
        // }
    }

    /* Methods */
    /**
     * @param {Tween.defaults|Object} data
     * @returns {{data: null, duration: number, delay: number, easing: string, interpolation: string}}
     */
    _tweenStateData(data) {
        return (data !== undefined && typeof data === 'object')
            ? ObjectUtil.extend(true, {}, Tween.stateDefaults, data)
            : Tween.stateDefaults;
    }

    /**
     * @param {Object} properties
     * @param {Tween.defaults|Object} [data]
     * @returns {Tween}
     */
    to(properties, data) {
        var tween = this;

        if (!tween.data.isStarted) {

            if (typeof data === 'number') data = {data: data};
            var stateData = (typeof data !== 'number') ? this._tweenStateData(data) : data;
            if (data !== undefined && typeof data === 'number') stateData.duration = data;

            tween.data.tweenStateStack.push([properties, stateData]);

            return tween;
        }

        // TODO:: Exceptions
        // throw new RuntimeException('You can not add a state after the start of the tween.');
    }

    /**
     * @param {number} time
     * @returns {boolean}
     */
    update(time) {
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
                    tween.data.chainedTweensStack[i].start(
                        tween.data.startTime + tween.getStateTimeDuration(tween.data.currentStateAnimation - 1, true)
                    );
                }
                return false;
            }
        }
        return true;
    }


    _calculateStackStateTimings(tweenStateStack) {
        var result = [];

        tweenStateStack.forEach(function (value) {
            result.push(value[1].duration);
        });

        return result;
    }

    /**
     * @param {number} [position]
     * @param {boolean} [withPrevious]
     *
     * @returns {number}
     */
    getStateTimeDuration(position, withPrevious) {
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
    }

    /**
     * @param {Array.<Object, Tween.stateDefaults>} startState
     * @param {Array.<Array<Object, Tween.stateDefaults>>} tweenStateStack
     */
    _calculateStackState(startState, tweenStateStack) {
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
                result.push([Tween.util.calculateProperties(result[index][0], ObjectUtil.extend(true, {}, result[index][0], value[0])), value[1]]);
                index++;
            }
        });

        return result;
    }

    /**
     * @param {number} [time]
     * @returns {Tween}
     */
    start(time) {
        var tween = this;
        if (time === undefined) time = global.performance.now();
        tween.data.isAnimated = true;

        if (!tween.data.isStarted) {
            tween.data.isStarted = true;
            tween.state = [Tween.util.cleanProperties(tween.node.data), Tween.stateDefaults];
            tween.data.tweenStateStack = this._calculateStackState(tween.state, tween.data.tweenStateStack);
            tween.data.tweenStateTimings = this._calculateStackStateTimings(tween.data.tweenStateStack);
        }

        tween.data.startTime = time + tween.data.delayTime;

        return Tween.add(tween);
    }

    /**
     * @returns {Tween}
     */
    stop() {
        var tween = this;
        if (!tween.data.isAnimated) return this;

        tween.data.isAnimated = false;
        tween.events.trigger('stop', [tween.node]);
        tween.stopChainedTweens();

        return Tween.remove(tween);
    }

    /**
     * @returns {Tween}
     */
    stopChainedTweens() {
        var tween = this;
        for (var i = 0; i < tween.data.chainedTweensStack.length; i++) {
            tween.data.chainedTweensStack[i].stop();
        }

        return tween;
    }


    /* Extended animation methods */
    /**
     * @param {number} delay
     * @returns {Tween}
     */
    delay(delay) {
        if (delay === undefined) delay = 1000;
        this.to('delay', delay);
        return this;
    }

    /**
     * @param {number} delay
     * @returns {Tween}
     */
    delayAll(delay) {
        if (delay === undefined) delay = 1000;
        this.to('delayAll', delay);
        return this;
    }

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    repeat(count) {
        if (count === undefined) count = 1;
        this.to('repeat', count);
        return this;
    }

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    repeatAll(count) {
        if (count === undefined) count = 1;
        this.to('repeatAll', count);
        return this;
    }

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    yoyo(count) {
        if (count === undefined) count = 1;
        this.to('yoyo', count);
        return this;
    }

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    reverse(count) {
        if (count === undefined) count = 1;
        this.to('reverse', count);
        return this;
    }

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    yoyoAll(count) {
        if (count === undefined) count = 1;
        this.to('yoyoAll', count);
        return this;
    }

    /**
     * @param {number} [count]
     * @returns {Tween}
     */
    reverseAll(count) {
        if (count === undefined) count = 1;
        this.to('reverseAll', count);
        return this;
    }


    /* Events wrappers */
    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    on(event, callback) {
        return this.events.on(event, callback);
    }

    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    off(event, callback) {
        return this.events.off(event, callback);
    }

    /**
     * @param {string} event
     * @param {function} callback
     * @returns {boolean}
     */
    once(event, callback) {
        return this.events.once(event, callback);
    }

    /**
     * @param {string} event
     * @returns {boolean}
     */
    flush(event) {
        return this.events.flush(event);
    }

    /**
     * @param {string} event
     * @param {Array.<*>} data
     * @returns {boolean}
     */
    trigger(event, data) {
        return this.events.trigger(event, data);
    }

    /* Static Methods */
    /**
     * @param {number} index
     * @returns {Array.<Tween>|Tween}
     */
    static get(index) {
        return (index === undefined) ? tweens : tweens[index];
    }

    /**
     * @param {Tween} tween
     * @returns {Tween}
     */
    static add(tween) {
        tweens.push(tween);
        return tween;
    }

    /**
     * @param {Tween} tween
     * @returns {Tween}
     */
    static remove(tween) {
        var i = tweens.indexOf(tween);
        if (i !== -1) tweens.splice(i, 1);
        return tween;
    }

    /**
     * @returns {void}
     */
    static flush() {
        tweens = [];
    }

    /**
     * @param {number} time
     * @returns {boolean}
     */
    static update(time) {
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
    }

    static util = {
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
    }
}
