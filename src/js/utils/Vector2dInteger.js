/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

import Vector2d from "Vector2d";

/**
 * @implements {IVector2dInteger}
 */
export default class Vector2dInteger extends Vector2d {
    constructor(x, y) {
        super(x >> 0, y >> 0);
    }

    fromArray(array) {
        this.x = array[0] >> 0;
        this.y = array[1] >> 0;

        return this
    }
}

if (window.J2D === undefined) window.Vector2dInteger = Vector2dInteger;
