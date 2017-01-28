import BaseGameState from "states/BaseGameState";

/**
 * Default game state
 *
 * @class DefaultGameState
 * @abstract
 * @constructor
 *
 * @param {GameStatesManager} gsm
 * @param {DefaultGameState.defaults|BaseGameState.defaults|Object} [data]
 * @property {DefaultGameState.defaults|BaseGameState.defaults|Object} data
 */
export default class DefaultGameState extends BaseGameState {
    constructor(gsm, data) {
        if (data === undefined) data = {};
        data.id = 'init_j2d';
        super(gsm, data);
    }

    // init(data) {
    //     return BaseGameState.prototype.init.call(this, data);
    // }
    //
    // load(data) {
    //     return BaseGameState.prototype.load.call(this, data);
    // }

    update(timestamp, data) {
        setTimeout(function () {
            this.gsm.setNextState();
        }.bind(this), 1000);
        return true;
    }

    // render(timestamp, data) {
    //     return true;
    // }
    //
    // unload(data) {
    //     return BaseGameState.prototype.unload.call(this, data);
    // }
}
