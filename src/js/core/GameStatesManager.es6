import ArrayMap from "utils/ArrayMap";
import ObjectUtil from "utils/ObjectUtil";
import DefaultGameState from "states/DefaultGameState";
import BaseGameState from "states/BaseGameState";

/**
 * Game states Manager
 *
 * @class GameStatesManager
 * @abstract
 * @constructor
 *
 * @param {GameStatesManager.defaults|Object} data
 * @param {function} sceneCallback
 * @property {GameStatesManager.defaults|Object} data
 * @property {number} state
 */
export default class GameStatesManager {
    /**
     * @type {{previousState: null, currentState: number, states: ArrayMap}}
     */
    static defaults = {
        previousState: null,
        currentState: 0,
        states: new ArrayMap()
    };

    constructor(data, sceneCallback) {
        this.data = ObjectUtil.extend(true, {}, GameStatesManager.defaults, data);
        this.add(new DefaultGameState());
        this.sceneCallback = sceneCallback;
    }

    get state() {
        return this.data.currentState;
    }

    set state(value) {
        this.data.currentState = value;
    }

    /**
     * @param {string} [id]
     * @returns {BaseGameState|null}
     */
    getState(id) {
        if (id === undefined) return this.getCurrent();
        if (this.data.states.contains(id)) {
            return this.data.states[id];
        }
        return null
    }

    getPreviousState() {
        return this.data.states.get(this.data.states[this.data.previousState]);
    }

    getNextState() {
        if (this.data.states[this.state + 1] !== undefined) {
            return this.data.states.get(this.data.states[this.state + 1]);
        }
        return null;
    }

    getCurrent() {
        return this.data.states.get(this.data.states[this.data.currentState]);
    }

    /**
     * @param {string} id
     */
    setState(id) {
        if (this.data.states.contains(id)) {
            this.data.previousState = this.data.currentState;
            this.data.currentState = this.data.states.indexOf(id);
            this.sceneCallback(id);
        }

        return this;
    }

    setNextState() {
        if (this.data.states[this.state + 1] !== undefined) {
            this.data.previousState = this.data.currentState;
            this.data.currentState = this.state + 1;
            this.sceneCallback(this.data.states[this.state]);
        }

        return this;
    }

    setPreviousState() {
        if (this.data.states[this.data.previousState] !== undefined) {
            var state = this.data.previousState;
            this.data.previousState = this.data.currentState;
            this.data.currentState = state;
            this.sceneCallback(this.data.states[state]);
        }

        return this;
    }

    /**
     * @param {BaseGameState} state
     * @param {string} [id]
     */
    add(state, id) {
        if (id === undefined) id = state.data.id;
        if (!this.data.states.contains(id) && state instanceof BaseGameState) {
            this.data.states.add(id, state);
        }
        return this;
    }

    /**
     * @param {string} id
     */
    remove(id) {
        if (this.data.states.contains(id)) {
            this.data.states.remove(id);
        }
        return this;
    }
}
