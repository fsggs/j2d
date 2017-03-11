import Immutable from "objects/Immutable";
import Mutable from "objects/Mutable";
import Handler from "api/Handler";
import RuntimeException from "exceptions/RuntimeException";

export default class BaseStore extends Handler {
    /** @type Immutable */
    state;

    constructor(state) {
        super();
        this.state = new Immutable(state);
    }

    /**
     * @return {Immutable}
     */
    getState() {
        return this.state;
    }

    /**
     * @param {Object} state
     * @param {function(Immutable, Immutable)} callback(newState, oldState)
     */
    setState(state, callback) {
        if (!this._isEnabled) throw new RuntimeException('Trying setState() on disabled store.');

        let oldState = this.state;
        this.state = new Immutable(Mutable.extend(true, {}, oldState.toJS(), state));


        if (this.events) {
            this.events.trigger('update', {
                newState: this.state,
                oldState
            });
        }

        if (callback) callback(this.state, oldState);
    }
}
