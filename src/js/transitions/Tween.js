/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @original_source https://github.com/tweenjs/tween.js
 * @license BSD, MIT(tween.js)
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('transitions/Tween', ['jquery', '../nodes/BaseNode', 'utils/Events'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('nodes/BaseNode'), require('utils/Events'));
    } else {
        factory(root.jQuery, root.j2d.nodes.BaseNode, root.j2d.utils.Events);
    }
}(typeof window !== 'undefined' ? window : global, function ($, BaseNode, Events) {
    "use strict";

    var tweens = [];

    var parseProperties = function (data) {
        var result = {};
        var temp;
        for (var field in data) {
            if (data.hasOwnProperty(field)) {
                temp = null;
                if (typeof data[field] === 'object') temp = parseProperties(data[field]);
                if (typeof data[field] === 'number') temp = parseFloat(data[field]);
                if (temp !== null) result[field] = temp;
            }
        }
        return Object.keys(result).length > 0 ? result : null;
    };

    /**
     * @constructor
     * @param {BaseNode|{data: object}} node
     * @param {Tween.defaults|Object} [data]
     * @property {Tween.defaults} data
     */
    var Tween = function (node, data) {
        var tween = this;
        tween.data = $.extend(true, {}, Tween.defaults, data);
        tween.node = node;
        tween.events = new Events();

        tween.data.startProperties = parseProperties(tween.node.data);
    };

    Tween.get = function (index) {
        return (index === undefined) ? tweens : tweens[index];
    };

    Tween.add = function (tween) {
        tweens.push(tween);
    };

    Tween.remove = function (tween) {
        var i = tweens.indexOf(tween);
        if (i !== -1) tweens.splice(i, 1);
    };

    Tween.update = function (time) {
        if (tweens.length === 0) return false;
        var i = 0;
        time = time !== undefined ? time : global.performance.now();

        while (i < tweens.length) {
            if (tweens[i].update(time)) {
                i++;
            } else {
                tweens.splice(i, 1);
            }
        }
        return true;
    };

    Tween.flush = function () {
        tweens = [];
    };

    Tween.prototype.to = function (properties, duration) {
        if (duration !== undefined) this.data.duration = duration;
        this.data.endProperties = properties;
        return this;
    };

    Tween.prototype.start = function (time) {
        var tween = this;
        Tween.add(this);

        tween.data.isAnimated = true;
        tween.data.isStarted = false;

        tween.data.startTime = time !== undefined ? time : global.performance.now();
        tween.data.startTime += tween.data.delay;

        // for (var property in tween.data.endProperties) {
        //     if (tween.data.endProperties.hasOwnProperty(property) && tween.data.startProperties.hasOwnProperty(property)) {
        //         if (tween.data.endProperties[property] instanceof Array) {
        //             if (tween.data.endProperties[property].length === 0) continue;
        //             tween.data.endProperties[property] = [tween.node.data[property]].concat(tween.data.endProperties[property]);
        //         }
        //
        //         if (tween.data.startProperties[property] === undefined) continue;
        //
        //         tween.data.startProperties[property] = tween.node.data[property];
        //
        //         if (!(tween.data.startProperties[property] instanceof Array)) {
        //             tween.data.startProperties[property] *= 1.0;
        //         }
        //
        //         tween.data.repeatProperties[property] = tween.data.startProperties[property] || 0;
        //     }
        // }

        return this;
    };

    Tween.prototype.stop = function () {
        var tween = this;
        if (!tween.data.isAnimated) return this;

        Tween.remove(this);
        tween.data.isAnimated = false;

        tween.events.trigger('stop', [tween.node]);

        tween.stopChainedTweens();
        return this;
    };

    Tween.prototype.stopChainedTweens = function () {
        var tween = this;
        for (i = 0; i < tween.data.chainedTweens.length; i++) {
            tween.data.chainedTweens[i].stop();
        }
    };

    Tween.prototype.delay = function (amount) {
        this.data.delay = amount;
        return this;
    };

    Tween.prototype.repeat = function (times) {
        this.data.repeat = times;
        return this;
    };

    Tween.prototype.yoyo = function (yoyo) {
        this.data.yoyo = yoyo;
        return this;
    };

    Tween.prototype.easing = function (easing) {
        this.data.easingFunction = easing;
        return this;
    };

    Tween.prototype.interpolation = function (interpolation) {
        this.data.interpolationFunction = interpolation;
        return this;
    };

    Tween.prototype.chain = function () {
        this.data.chainedTweens = arguments;
        return this;
    };

    Tween.prototype.old_update = function (time) {
        var tween = this;

        var property;
        var elapsed;
        var value;

        if (time < tween.data.startTime) return true;

        if (!tween.data.isStarted) {
            tween.events.trigger('start', [tween.node]);
            tween.data.isStarted = true;
        }

        elapsed = (time - tween.data.startTime) / tween.data.duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        value = tween.data.easingFunction(elapsed);

        for (property in tween.data.endProperties) {
            if (tween.data.endProperties.hasOwnProperty(property) && tween.data.startProperties.hasOwnProperty(property)) {
                if (tween.data.startProperties[property] === undefined) continue;

                var start = tween.data.startProperties[property] || 0;
                var end = tween.data.endProperties[property];

                if (end instanceof Array) {
                    tween.node.data[property] = tween.data.interpolationFunction(end, value);
                } else {
                    if (typeof (end) === 'string') {
                        end = (end.lastIndexOf('+', 0) === 0 || end.lastIndexOf('-', 0) === 0)
                            ? start + parseFloat(end)
                            : parseFloat(end);
                    }
                    if (typeof (end) === 'number') {
                        tween.node.data[property] = start + (end - start) * value;
                    }
                }
            }
        }

        tween.events.trigger('update', [tween.node]);

        if (elapsed === 1) {
            if (tween.data.repeat > 0) {
                if (isFinite(tween.data.repeat)) {
                    tween.data.repeat--;
                }
                for (property in tween.data.repeatProperties) {
                    if (tween.data.repeatProperties.hasOwnProperty(property)) {
                        if (typeof (tween.data.endProperties[property]) === 'string') {
                            tween.data.repeatProperties[property] = tween.data.repeatProperties[property] + parseFloat(tween.data.endProperties[property]);
                        }

                        if (tween.data.yoyo) {
                            var tmp = tween.data.repeatProperties[property];
                            tween.data.repeatProperties[property] = tween.data.endProperties[property];
                            tween.data.endProperties[property] = tmp;
                        }

                        tween.data.startProperties[property] = tween.data.repeatProperties[property];
                    }
                }

                if (tween.data.yoyo) {
                    tween.data.reversed = !tween.data.reversed;
                }
                tween.data.startTime = time + tween.data.delay;

                return true;
            } else {
                tween.events.trigger('complete', [tween.node]);
                for (i = 0; i < tween.data.chainedTweens.length; i++) {
                    tween.data.chainedTweens[i].start(tween.data.startTime + tween.data.duration);
                }
                return false;
            }
        }
        return true;
    };

    var calcTween = function(endProperties, startProperties, value) {
        var result = {};
        var property;
        var temp;

        for (property in endProperties) {
            if (endProperties.hasOwnProperty(property) && startProperties.hasOwnProperty(property)) {
                temp = null;
                if (typeof startProperties[property] === 'number') {
                    temp = startProperties[property] + (endProperties[property] - startProperties[property]) * value;
                }
                if (typeof startProperties[property] === 'object') {
                    temp = calcTween(endProperties[property], startProperties[property], value);
                }

                if (temp !== null) result[property] = temp;
            }
        }

        return Object.keys(result).length > 0 ? result : null;
    };

    Tween.prototype.update = function (time) {
        var tween = this;

        var property;
        var elapsed;
        var data;

        if (time < tween.data.startTime) return true;

        if (!tween.data.isStarted) {
            tween.events.trigger('start', [tween.node]);
            tween.data.isStarted = true;
        }

        elapsed = (time - tween.data.startTime) / tween.data.duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        data = calcTween(tween.data.endProperties, tween.data.startProperties, tween.data.easingFunction(elapsed));
        tween.node.import(data);

        tween.events.trigger('update', [tween.node]);
        //
        // if (elapsed === 1) {
        //     if (tween.data.repeat > 0) {
        //         if (isFinite(tween.data.repeat)) {
        //             tween.data.repeat--;
        //         }
        //         for (property in tween.data.repeatProperties) {
        //             if (tween.data.repeatProperties.hasOwnProperty(property)) {
        //                 if (typeof (tween.data.endProperties[property]) === 'string') {
        //                     tween.data.repeatProperties[property] = tween.data.repeatProperties[property] + parseFloat(tween.data.endProperties[property]);
        //                 }
        //
        //                 if (tween.data.yoyo) {
        //                     var tmp = tween.data.repeatProperties[property];
        //                     tween.data.repeatProperties[property] = tween.data.endProperties[property];
        //                     tween.data.endProperties[property] = tmp;
        //                 }
        //
        //                 tween.data.startProperties[property] = tween.data.repeatProperties[property];
        //             }
        //         }
        //
        //         if (tween.data.yoyo) {
        //             tween.data.reversed = !tween.data.reversed;
        //         }
        //         tween.data.startTime = time + tween.data.delay;
        //
        //         return true;
        //     } else {
        //         tween.events.trigger('complete', [tween.node]);
        //         for (i = 0; i < tween.data.chainedTweens.length; i++) {
        //             tween.data.chainedTweens[i].start(tween.data.startTime + tween.data.duration);
        //         }
        //         return false;
        //     }
        // }
        return true;
    };

    Tween.prototype.on = function (event, callback) {
        this.events.on(event, callback);
    };

    Tween.prototype.off = function (event, callback) {
        this.events.off(event, callback);
    };

    Tween.prototype.once = function (event, callback) {
        this.events.once(event, callback);
    };

    Tween.prototype.flush = function (event) {
        this.events.flush(event);
    };

    Tween.prototype.trigger = function (event, data) {
        this.events.trigger(event, data);
    };

    /* Easing */
    Tween.Easing = {
        Linear: {
            None: function (k) {
                return k;
            }
        },

        Quadratic: {
            /**
             * @return {number}
             */
            In: function (k) {
                return k * k;
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                return k * (2 - k);
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                if ((k *= 2) < 1) return 0.5 * k * k;
                return -0.5 * (--k * (k - 2) - 1);
            }
        },

        Cubic: {
            /**
             * @return {number}
             */
            In: function (k) {
                return k * k * k;
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                return --k * k * k + 1;
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k;
                return 0.5 * ((k -= 2) * k * k + 2);
            }
        },

        Quartic: {
            /**
             * @return {number}
             */
            In: function (k) {
                return k * k * k * k;
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                return 1 - (--k * k * k * k);
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                if ((k *= 2) < 1)  return 0.5 * k * k * k * k;
                return -0.5 * ((k -= 2) * k * k * k - 2);
            }

        },

        Quintic: {
            /**
             * @return {number}
             */
            In: function (k) {
                return k * k * k * k * k;
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                return --k * k * k * k * k + 1;
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            }

        },

        Sinusoidal: {
            /**
             * @return {number}
             */
            In: function (k) {
                return 1 - Math.cos(k * Math.PI / 2);
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                return Math.sin(k * Math.PI / 2);
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            }
        },

        Exponential: {
            /**
             * @return {number}
             */
            In: function (k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                if (k === 0) return 0;
                if (k === 1) return 1;
                if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);

                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            }
        },

        Circular: {
            /**
             * @return {number}
             */
            In: function (k) {
                return 1 - Math.sqrt(1 - k * k);
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                return Math.sqrt(1 - (--k * k));
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            }
        },

        Elastic: {
            /**
             * @return {number}
             */
            In: function (k) {
                var s;
                var a = 0.1;
                var p = 0.4;

                if (k === 0) return 0;
                if (k === 1) return 1;

                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }

                return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                var s;
                var a = 0.1;
                var p = 0.4;

                if (k === 0) return 0;
                if (k === 1) return 1;

                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }

                return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
            },

            /**
             * @return {number}
             */
            InOut: function (k) {

                var s;
                var a = 0.1;
                var p = 0.4;

                if (k === 0) return 0;
                if (k === 1) return 1;

                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }

                if ((k *= 2) < 1) {
                    return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                }

                return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

            }

        },

        Back: {
            /**
             * @return {number}
             */
            In: function (k) {
                var s = 1.70158;

                return k * k * ((s + 1) * k - s);
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                var s = 1.70158;

                return --k * k * ((s + 1) * k + s) + 1;
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                var s = 1.70158 * 1.525;
                if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));

                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            }
        },

        Bounce: {
            /**
             * @return {number}
             */
            In: function (k) {
                return 1 - Tween.Easing.Bounce.Out(1 - k);
            },

            /**
             * @return {number}
             */
            Out: function (k) {
                if (k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            },

            /**
             * @return {number}
             */
            InOut: function (k) {
                if (k < 0.5) return Tween.Easing.Bounce.In(k * 2) * 0.5;
                return Tween.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            }
        }
    };

    /* Interpolation */
    Tween.Interpolation = {
        Linear: function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = Tween.Interpolation.Utils.Linear;

            if (k < 0) return fn(v[0], v[1], f);
            if (k > 1) return fn(v[m], v[m - 1], m - f);

            return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

        },

        /**
         * @return {number}
         */
        Bezier: function (v, k) {
            var b = 0;
            var n = v.length - 1;
            var pw = Math.pow;
            var bn = Tween.Interpolation.Utils.Bernstein;

            for (var i = 0; i <= n; i++) {
                b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
            }

            return b;

        },

        /**
         * @return {number}
         */
        CatmullRom: function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = Tween.Interpolation.Utils.CatmullRom;

            if (v[0] === v[m]) {
                if (k < 0) i = Math.floor(f = m * (1 + k));

                return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
            } else {
                if (k < 0) return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
                if (k > 1) return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);

                return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            }
        },

        Utils: {
            Linear: function (p0, p1, t) {
                return (p1 - p0) * t + p0;
            },

            /**
             * @return {number}
             */
            Bernstein: function (n, i) {
                var fc = Tween.Interpolation.Utils.Factorial;
                return fc(n) / fc(i) / fc(n - i);
            },

            Factorial: (function () {
                var a = [1];
                return function (n) {
                    var s = 1;
                    if (a[n]) return a[n];

                    for (var i = n; i > 1; i--) {
                        s *= i;
                    }
                    a[n] = s;

                    return s;
                };
            })(),

            CatmullRom: function (p0, p1, p2, p3, t) {
                var v0 = (p2 - p0) * 0.5;
                var v1 = (p3 - p1) * 0.5;
                var t2 = t * t;
                var t3 = t * t2;

                return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
            }
        }
    };

    Tween.defaults = {
        startProperties: {},
        endProperties: {},
        repeatProperties: {},
        startTime: null,

        chainedTweens: [],

        duration: 1000,
        repeat: 0,
        delay: 0,

        yoyo: false,

        isAnimated: false,
        isStarted: false,

        easingFunction: Tween.Easing.Linear.None,
        interpolationFunction: Tween.Interpolation.Linear
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Tween = Tween;
    if (global.j2d === undefined) global.j2d.transitions.Tween = Tween;
    return Tween;
}));




