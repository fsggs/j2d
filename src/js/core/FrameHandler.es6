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
        pause: false,

        now: Date.now(),
        lastTime: Date.now(),
        deltaTime: 0,
        interval: 1000.0 / FrameHandler._frameLimit
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

                this._data.now = Date.now();
                this._data.deltaTime = (this._data.now - this._data.lastTime) / 100.0;

                if ((this._data.deltaTime * 100.0) > this._data.interval) {
                    this._data.lastTime = this._data.now - ((this._data.deltaTime * 100.0) % this._data.interval);

                    engine._data.timestamp = timestamp;
                    engine._data.deltaTime = this._data.deltaTime;

                    // TODO:: temporary hack!
                    if (engine.update && typeof engine.update === 'function') {
                        engine.update(this._data.deltaTime, timestamp);
                    }

                    // TODO:: temporary hack!
                    if (engine.render && typeof engine.render === 'function') {
                        engine.render(this._data.deltaTime, timestamp);
                    }
                }

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
