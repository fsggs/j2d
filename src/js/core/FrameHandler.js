/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 1.0.0-dev
 */

if (global === undefined) var global = window || this;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/FrameHandler', ['api/Handler'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/Handler'));
    } else {
        factory(root.j2d.api.Handler);
    }
}(typeof window !== 'undefined' ? window : global, function (Handler) {
    "use strict";

    /**
     * FrameHandler
     * @constructor
     */
    var FrameHandler = function () {
        var timestamp = 0;

        this.renderEngine = null;
        this.inputHandler = null;

        this.engineStack = [];

        this.options = {
            frameLimit: 60,
            pause: false
        };

        this.store = {
            breakAnimationFrame: false
        };

        var requestAnimationFrame = (function () {
            return global.requestAnimationFrame ||
                global.webkitRequestAnimationFrame ||
                global.mozRequestAnimationFrame ||
                global.oRequestAnimationFrame ||
                global.msRequestAnimationFrame ||
                (function (callback) {
                    if (!this.store.breakAnimationFrame) {
                        if (timestamp >= Number.MAX_SAFE_INTEGER - 1) timestamp = 0;
                        if (timestamp === 0) timestamp = global.performance === undefined
                            ? Date.now()
                            : global.performance.now();
                        global.setTimeout(callback.bind(this, global.performance === undefined
                            ? Date.now() - timestamp
                            : global.performance.now() - timestamp
                        ), 1000.0 / this.options.frameLimit);
                    } else {
                        this.store.breakAnimationFrame = false
                    }
                }.bind(this));
        }.bind(this))();

        var cancelAnimationFrame = (function () {
            timestamp = 0;
            return global.cancelAnimationFrame ||
                global.webkitCancelAnimationFrame ||
                global.mozCancelAnimationFrame ||
                global.oCancelAnimationFrame ||
                global.msCancelAnimationFrame;
        }.bind(this))();

        var started = false;
        this.loop = function (timestamp) {
            if (this.engineStack.length <= 0 && started || this.options.pause) {
                this.store.breakAnimationFrame = true;
                started = false;
                return cancelAnimationFrame(this.loop);
            }
            started = true;
            requestAnimationFrame(function (timestamp) {
                this.loop(timestamp);
            }.bind(this));

            for (var i = 0; i < this.engineStack; i++) {
                if (!this.engineStack[i].data.isEnabled) continue;
                var engine = this.engineStack[i];

                if (!engine.data.pause) {
                    if (engine.IO) engine.IO.update();
                    var data = engine.data.render;

                    data.now = Date.now();
                    data.deltaTime = (data.now - data.lastTime) / 100.0;

                    if (engine.update !== undefined && 'function' === typeof engine.update) {
                        if (engine.data.asyncUpdate) {
                            setTimeout(engine.update.bind(engine, timestamp, data), 0);
                            setTimeout(engine.tweens.update.bind(engine, timestamp), 0);
                        } else {
                            engine.update(timestamp, data);
                            engine.tweens.update(timestamp);
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

                    if (engine.IO) engine.IO.clear();
                }
            }

        }.bind(this);

        this.start = function (engineHandler) {
            if (this.engineStack[engineHandler.guid] === undefined) {
                this.engineStack[engineHandler.guid] = engineHandler;
                this.engineStack.push(engineHandler);
            }
            if (!started) this.loop(Date.now());
            return this;
        };

        this.stop = function (engineHandler) {
            if (this.engineStack[engineHandler.guid] !== undefined) {
                delete this.engineStack[engineHandler.guid];
                this.engineStack.splice(this.engineStack.indexOf(engineHandler.guid), 1);
            }
            return this;
        };

        this.setDefaultFrameLimit = function (frameLimit) {
            if (frameLimit <= 60 && frameLimit > 0) {
                this.options.frameLimit = frameLimit
            }
            return this;
        };
    };

    FrameHandler.prototype = Object.create(Handler.prototype);
    FrameHandler.prototype.constructor = FrameHandler;

    FrameHandler.prototype.init = function (eventHandler, renderEngine) {
        this.renderEngine = renderEngine;
        Handler.prototype.init.call(this, eventHandler);
        return this;
    };

    FrameHandler.prototype.enable = function () {
        Handler.prototype.enable.call(this);
        this.options.pause = false;
        this.loop(Date.now());
        return this;
    };

    FrameHandler.prototype.disable = function () {
        Handler.prototype.disable.call(this);
        this.options.pause = true;
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.FrameHandler = FrameHandler;
    if (global.j2d !== undefined) global.j2d.core.FrameHandler = FrameHandler;
    return FrameHandler;
}));
