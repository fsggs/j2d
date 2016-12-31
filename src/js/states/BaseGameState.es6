import ObjectUtil from "utils/ObjectUtil";
import UUID from "utils/UUID";
import Events from "utils/Events";
/**
 * Base class of state
 *
 * @class BaseGameState
 * @abstract
 * @constructor
 *
 * @param {GameStatesManager} gsm
 * @param {BaseGameState.defaults|Object} [data]
 * @property {BaseGameState.defaults|Object} data
 * @property {string} id
 */
export default class BaseGameState {
    static defaults = {
        id: 'BaseState',
        currentState: 0
    };

    static STATE = {
        STATE_NOT_LOADED: 0,
        STATE_INIT: 1,
        STATE_LOAD: 2,
        STATE_UPDATE: 3,
        STATE_RENDER: 4,
        STATE_UNLOAD: 5
    };

    constructor(gsm, data) {
        if (data === undefined) data = {};
        if (data === undefined) data = {};
        data.currentState = 0;
        if (data.id === undefined || data.id === null) {
            data.id = UUID.generate();
        }
        this.data = ObjectUtil.extend(true, {}, BaseGameState.defaults, data);

        this.gsm = gsm;
        this.loader = null;
        this.events = new Events();
    }

    get id() {
        return this.data.id;
    }

    set id(value) {
        this.data.id = value;
    }

    init(data) {
        if (typeof data === 'object' && data.callback !== undefined) {
            data.callback();
        }
        return true;
    }

    load(data) {
        if (typeof data === 'object' && data.callback !== undefined) data.callback();
        return true;
    }

    update(timestamp, data) {
        return true;
    }

    render(timestamp, data) {
        return true;
    }

    unload(data) {
        if (typeof data === 'object' && data.callback !== undefined) data.callback();
        return true;
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
}
