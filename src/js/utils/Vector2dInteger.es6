import Vector2d from "utils/Vector2d";

/**
 * @class Vector2dInteger
 * @exports module:utils/Vector2dInteger
 *
 * @constructor
 * @extends utils/Vector2d
 * @param {number} x
 * @param {number} y
 */
export default class Vector2dInteger extends Vector2d {
    constructor(x, y) {
        super(x >> 0, y >> 0);
    }

    /**
     * @param {Array.<number>} array
     * @returns {Vector2d|Vector2dInteger}
     */
    fromArray(array) {
        this.x = array[0] >> 0;
        this.y = array[1] >> 0;

        return this;
    }
}
