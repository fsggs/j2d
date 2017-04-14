import EngineComponent from "api/EngineComponent";

/**
 * FrameHandler
 * @constructor
 */
export default class FrameHandler extends EngineComponent {
    static instance;

    static _timestamp = 0;
    static _frameLimit = 60;

    static _breakAnimationFrame = false;

    /**
     * @type {Array}
     * @private
     */
    _engineStack = [];

    /**
     * @private
     * @type {{start: boolean, pause: boolean}}}
     */
    _data = {
        start: false,
        pause: false
    };

    /** @private */
    _loop;

    constructor() {
        super();
    }

    static set frameLimit(value) {
        if (value <= 60 && value > 0) {
            FrameHandler._frameLimit = value
        }
        return FrameHandler._frameLimit || value;
    }

    get isStarted() {
        return this._data.start;
    }

    get isPaused() {
        return this._data.pause;
    }

    loop(timestamp) {
        if (this._loop === undefined) this._loop = (timestamp) => {
            this.loop(timestamp);
        };

        if (this._engineStack.length <= 0 && this._data.start || this._data.pause) {
            FrameHandler._breakAnimationFrame = true;
            this._data.start = false;
            return CancelAnimationFrame(this._loop);
        }
        this._data.start = true;

        RequestAnimationFrame(this._loop);

        for (let i = 0; i < this._engineStack.length; i++) {
            if (!this._engineStack[i].isEnabled) continue;
            let engine = this._engineStack[i];

            if (!engine._data.pause) {
                if (engine.io) engine.io.update();

                // TODO:: temporary hack!
                if (engine.update && typeof engine.update === 'function') engine.update(timestamp);

                //let data = engine.data.render;

                //data.now = Date.now();
                //data.deltaTime = (data.now - data.lastTime) / 100.0;

                // if (engine.update !== undefined && 'function' === typeof engine.update) {
                //     if (engine.data.asyncUpdate) {
                //         setTimeout(engine.update.bind(engine, timestamp, data), 0);
                //         setTimeout(engine.tweens.update.bind(engine, timestamp), 0);
                //     } else {
                //         engine.update(timestamp, data);
                //         engine.tweens.update(timestamp);
                //     }
                // }

                // if ((data.deltaTime * 100.0) > data.interval) {
                //     data.lastTime = data.now - ((data.deltaTime * 100.0) % data.interval);
                //
                //     if (engine.render !== undefined && 'function' === typeof engine.render) {
                //         if (data.asyncRender) {
                //             setTimeout(engine.render.bind(engine, timestamp, data), 0);
                //         } else {
                //             engine.render(timestamp, data);
                //         }
                //     }
                // }

                if (engine.io) engine.io.clear();
            }
        }
    }

    start(engineHandler) {
        if (this._engineStack[engineHandler.guid] === undefined) {
            this._engineStack[engineHandler.guid] = engineHandler;
            this._engineStack.push(engineHandler);
        }
        if (!this._data.start) this.loop(Date.now() - FrameHandler._timestamp);
        return this;
    }

    stop(engineHandler) {
        if (this._engineStack[engineHandler.guid] !== undefined) {
            delete this._engineStack[engineHandler.guid];
            this._engineStack.splice(this._engineStack.indexOf(engineHandler.guid), 1);
        }
        return this;
    }

    init(eventHandler) {
        super.init(eventHandler);
        return this;
    }

    enable() {
        super.enable();
        this._data.pause = false;
        return this;
    }

    disable() {
        super.disable();
        this._data.pause = true;
        return this;
    }

    /**
     * @singleton
     * @returns {FrameHandler}
     */
    static init() {
        return FrameHandler.instance || (FrameHandler.instance = new FrameHandler());
    }
}

export const RequestAnimationFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        ((callback) => {
            if (!FrameHandler._breakAnimationFrame) {
                if (FrameHandler._timestamp >= Number.MAX_SAFE_INTEGER - 1) FrameHandler._timestamp = 0;
                if (FrameHandler._timestamp === 0) FrameHandler._timestamp = window.performance === undefined
                    ? Date.now()
                    : window.performance.now();

                // The probability of operation of this polyfill is so small that use of .bind() won't affect working
                // capacity, at the same time such approach guarantees correctness of operation of a method.
                window.setTimeout(callback.bind(this, window.performance === undefined
                    ? Date.now() - FrameHandler._timestamp
                    : window.performance.now() - FrameHandler._timestamp
                ), 1000.0 / FrameHandler._frameLimit);
            } else {
                FrameHandler._breakAnimationFrame = false
            }
        });
})();

export const CancelAnimationFrame = (() => {
    FrameHandler.timestamp = 0;
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame;
})();
