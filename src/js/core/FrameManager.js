/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/FrameManager', ['utils/ArrayMap'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/ArrayMap'));
    } else {
        factory(root.ArrayMap);
    }
}(typeof window !== 'undefined' ? window : global,
    /**
     * @param {Function} ArrayMap
     * @returns {FrameManager}
     */
    function (ArrayMap) {
        "use strict";

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
                        if (timestamp === 0) timestamp = Date.now();

                        global.setTimeout(callback.bind(this, Date.now() - timestamp), 1000.0 / options.frameLimit);
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


        var FrameManager = function () {
        };

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
        };

        FrameManager.prototype.stop = function (name) {
            engineStack.remove(name);
            dataStack.remove(name);
        };

        FrameManager.prototype.pulse = function () {
            this.runMainLoop(Date.now());
        };

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
                                setTimeout(engine.update.bind(this, timestamp, data), 0);
                            } else {
                                engine.update(timestamp, data);
                            }
                        }

                        if ((data.deltaTime * 100.0) > data.interval) {
                            data.lastTime = data.now - ((data.deltaTime * 100.0) % data.interval);

                            if (engine.render !== undefined && 'function' === typeof engine.render) {
                                if (data.asyncRender) {
                                    setTimeout(engine.render.bind(this, timestamp, data), 0);
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

        FrameManager.prototype.setDefaultFrameLimit = function (frameLimit) {
            if (frameLimit <= 60 && frameLimit > 0) {
                options.frameLimit = frameLimit
            }
        };

        /**
         * @singleton
         * @returns {FrameManager}
         */
        FrameManager.Init = function () {
            if (global.J2D !== undefined) {
                return global.instanceFrameManager || (global.instanceFrameManager = new FrameManager());
            } else {
                return instance || (instance = new FrameManager());
            }
        };

        if (global.J2D === undefined) global.FrameManager = FrameManager;

        return FrameManager;
    }
));
