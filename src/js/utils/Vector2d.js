/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

/**
 * @implements {IVector2d}
 */
export default class Vector2d {
    constructor(x, y) {
        this.x = x + 0.0;
        this.y = y + 0.0;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getCoordinates() {
        return this;
    }

    toArray() {
        return [this.x, this.y];
    }

    fromArray(array) {
        this.x = array[0] + 0.0;
        this.y = array[1] + 0.0;

        return this;
    }

    toString() {
        return "(" + this.x + "," + this.y + ")";
    }
}

if (window.J2D === undefined) window.Vector2d = Vector2d;
