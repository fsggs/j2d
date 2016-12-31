import Handler from "api/Handler";

/**
 * FrameHandler
 * @constructor
 */
export class FrameHandler extends Handler {
    timestamp = 0;
    started = false;

    renderEngine = null;
    inputHandler = null;

    engineStack = [];

    options = {
        frameLimit: 60,
        pause: false
    };

    store = {
        breakAnimationFrame: false
    };

    constructor() {
        super();

        this.requestAnimationFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                (function (callback) {
                    if (!this.store.breakAnimationFrame) {
                        if (this.timestamp >= Number.MAX_SAFE_INTEGER - 1) this.timestamp = 0;
                        if (this.timestamp === 0) this.timestamp = window.performance === undefined
                            ? Date.now()
                            : window.performance.now();
                        window.setTimeout(callback.bind(this, window.performance === undefined
                            ? Date.now() - this.timestamp
                            : window.performance.now() - this.timestamp
                        ), 1000.0 / this.options.frameLimit);
                    } else {
                        this.store.breakAnimationFrame = false
                    }
                }.bind(this));
        }.bind(this))();

        this.cancelAnimationFrame = (function () {
            this.timestamp = 0;
            return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                window.msCancelAnimationFrame;
        }.bind(this))();

        this.loop = this.loop.bind(this);
    }

    loop(timestamp) {
        if (this.engineStack.length <= 0 && this.started || this.options.pause) {
            this.store.breakAnimationFrame = true;
            this.started = false;
            return this.cancelAnimationFrame(this.loop);
        }
        this.started = true;
        this.requestAnimationFrame(function (timestamp) {
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
    }

    start(engineHandler) {
        if (this.engineStack[engineHandler.guid] === undefined) {
            this.engineStack[engineHandler.guid] = engineHandler;
            this.engineStack.push(engineHandler);
        }
        if (!this.started) this.loop(Date.now());
        return this;
    }

    stop(engineHandler) {
        if (this.engineStack[engineHandler.guid] !== undefined) {
            delete this.engineStack[engineHandler.guid];
            this.engineStack.splice(this.engineStack.indexOf(engineHandler.guid), 1);
        }
        return this;
    }

    setDefaultFrameLimit(frameLimit) {
        if (frameLimit <= 60 && frameLimit > 0) {
            this.options.frameLimit = frameLimit
        }
        return this;
    }

    init(eventHandler, renderEngine) {
        this.renderEngine = renderEngine;
        Handler.prototype.init.call(this, eventHandler);
        return this;
    }

    enable() {
        Handler.prototype.enable.call(this);
        this.options.pause = false;
        this.loop(Date.now());
        return this;
    }

    disable() {
        Handler.prototype.disable.call(this);
        this.options.pause = true;
        return this;
    }
}
