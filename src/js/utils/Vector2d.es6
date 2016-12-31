/**
 * @class Vector2d
 * @exports module:utils/Vector2d
 *
 * @constructor
 * @param {number} x
 * @param {number} y
 */
export default class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @returns {number}
     */
    getX() {
        return this.x;
    }

    /**
     * @returns {number}
     */
    getY() {
        return this.y;
    }

    /**
     * @returns {{x: number, y: number}}
     */
    getVector() {
        return {x: this.x, y: this.y};
    }

    /**
     * @returns {Array.<number>}
     */
    toArray() {
        return [this.x, this.y];
    }

    /**
     * @param {Array.<number>} array
     * @returns {Vector2d}
     */
    fromArray(array) {
        this.x = array[0];
        this.y = array[1];

        return this;
    }

    /**
     * @returns {string}
     */
    toString() {
        return "(" + this.x + "," + this.y + ")";
    }

    /**
     * @param {Vector2d} vector1
     * @param {Vector2d} vector2
     * @returns {number}
     */
    static getDistance(vector1, vector2) {
        return Math.sqrt(
            Math.pow(vector2.getVector().x - vector1.getVector().x, 2) +
            Math.pow(vector2.getVector().y - vector1.getVector().y, 2)
        );
    }

    /**
     * @param {Vector2d} vector1
     * @param {Vector2d} vector2
     * @returns {number}
     */
    static getAngle(vector1, vector2) {
        return Math.atan2(
                vector2.getVector().y - vector1.getVector().y,
                vector2.getVector().x - vector1.getVector().x
            ) * (180 / Math.PI);
    }
}
