/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/FrameManager', ['utils/ArrayMap', 'transitions/Tween'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/ArrayMap'), require('transitions/Tween'));
    } else {
        factory(root.j2d.utils.ArrayMap, root.j2d.transitions.Tween);
    }
}(typeof window !== 'undefined' ? window : global,
    /**
     * @param {Function} ArrayMap
     * @param {Tween} Tween
     * @returns {FrameManager}
     */
    function (ArrayMap, Tween) {
        "use strict";

        /** @type FrameManager */
        var instance;
        var engineStack = new ArrayMap(), dataStack = new ArrayMap();
        var timestamp = 0;

        var options = {
            frameLimit: 60,
            frameRun: false,
            breakAnimationFrame: false
        };

        var requestAnimationFrame = (function () {
            return global.requestAnimationFrame ||
                global.webkitRequestAnimationFrame ||
                global.mozRequestAnimationFrame ||
                global.oRequestAnimationFrame ||
                global.msRequestAnimationFrame ||
                (function (callback) {
                    if (!options.breakAnimationFrame) {
                        if (timestamp >= Number.MAX_SAFE_INTEGER - 1) timestamp = 0;
                        if (timestamp === 0) timestamp = global.performance === undefined
                            ? Date.now()
                            : global.performance.now();
                        global.setTimeout(callback.bind(this, global.performance === undefined
                            ? Date.now() - timestamp
                            : global.performance.now() - timestamp
                        ), 1000.0 / options.frameLimit);
                    } else {
                        options.breakAnimationFrame = false
                    }
                });
        })();

        var cancelAnimationFrame = (function () {
            timestamp = 0;
            return global.cancelAnimationFrame ||
                global.webkitCancelAnimationFrame ||
                global.mozCancelAnimationFrame ||
                global.oCancelAnimationFrame ||
                global.msCancelAnimationFrame;
        })();


        /**
         * @class FrameManager
         * @exports module:core/FrameManager
         *
         * @constructor
         */
        var FrameManager = function () {
        };

        /**
         * @param {string} name
         * @param {BaseState} engine
         * @param {Object} [params]
         * @returns {FrameManager}
         */
        FrameManager.prototype.start = function (name, engine, params) {
            var data = {
                j2d: null,
                frameLimit: options.frameLimit,
                now: 0,
                deltaTime: 0,
                lastTime: 0,
                sceneStartTime: 0,
                sceneSkipTime: 0,

                asyncUpdate: true,
                asyncRender: true
            };

            if (params.frameLimit !== undefined && params.frameLimit <= options.frameLimit) data.frameLimit = params.frameLimit;

            if (params.j2d !== undefined) {
                data.j2d = params.j2d;
            } else {
                throw 'j2d not transported to FrameManager.start(id, engine, {... j2d: j2d ...});';
            }

            data.interval = 1000.0 / data.frameLimit;
            data.lastTime = Date.now();

            engineStack.add(name, engine);
            dataStack.add(name, data);
            if (!options.frameRun) this.pulse();

            return this;
        };

        /**
         * @param {string} name
         * @returns {FrameManager}
         */
        FrameManager.prototype.stop = function (name) {
            engineStack.remove(name);
            dataStack.remove(name);
            return this;
        };

        /**
         * @returns {FrameManager}
         */
        FrameManager.prototype.pulse = function () {
            this.runMainLoop(Date.now());
            return this;
        };

        /**
         * @param {number} timestamp
         * @param {FrameManager} [frameManager]
         */
        FrameManager.prototype.runMainLoop = function (timestamp, frameManager) {
            if (frameManager === undefined) frameManager = this;

            if (engineStack.length <= 0 && options.frameRun) {
                options.breakAnimationFrame = true;
                options.frameRun = false;
                return cancelAnimationFrame(this.runMainLoop);
            }
            options.frameRun = true;

            requestAnimationFrame(function (timestamp) {
                frameManager.runMainLoop(timestamp, frameManager);
            });

            engineStack.each(function (index) {
                if (engineStack.hasOwnProperty(index) && 'object' === typeof engineStack[index]) {
                    var engine = engineStack[index];
                    var data = dataStack[index];

                    data.now = Date.now();
                    data.deltaTime = (data.now - data.lastTime) / 100.0;

                    if (data.j2d.data.io && !data.j2d.data.pause) data.j2d.data.io.update();

                    if (!data.j2d.data.pause) {
                        if (engine.update !== undefined && 'function' === typeof engine.update) {
                            if (data.asyncUpdate) {
                                setTimeout(engine.update.bind(engine, timestamp, data), 0);
                                setTimeout(Tween.update.bind(this, timestamp), 0);
                            } else {
                                engine.update(timestamp, data);
                                Tween.update(timestamp);
                            }
                        }

                        if ((data.deltaTime * 100.0) > data.interval) {
                            data.lastTime = data.now - ((data.deltaTime * 100.0) % data.interval);

                            if (engine.render !== undefined && 'function' === typeof engine.render) {
                                if (data.asyncRender) {
                                    setTimeout(engine.render.bind(engine, timestamp, data), 0);
                                } else {
                                    engine.render(timestamp, data);
                                }
                            }
                        }
                    }
                    if (data.j2d.data.io && !data.j2d.data.pause) data.j2d.data.io.clear();
                }
            });
        };

        /**
         * @param {number} frameLimit
         * @returns {FrameManager}
         */
        FrameManager.prototype.setDefaultFrameLimit = function (frameLimit) {
            if (frameLimit <= 60 && frameLimit > 0) {
                options.frameLimit = frameLimit
            }
            return this;
        };

        /**
         * @singleton
         * @returns {FrameManager}
         */
        FrameManager.Init = function () {
            if (global.j2d !== undefined) {
                return global.instanceFrameManager || (global.instanceFrameManager = new FrameManager());
            } else {
                return instance || (instance = new FrameManager());
            }
        };

        if (typeof module === 'object' && typeof module.exports === 'object') module.exports.FrameManager = FrameManager;
        if (global.j2d !== undefined) global.j2d.core.FrameManager = FrameManager;
        return FrameManager;
    }
));
