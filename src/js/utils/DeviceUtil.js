/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

import $ from "jquery";
import Vector2dInteger from "Vector2dInteger";

/**
 * Class utility for get system browser window size
 *
 * @implements {IDeviceUtil}
 */
export default class DeviceUtil {
    constructor() {
        this.width = parseInt($(document).width()) < parseInt(screen.width) ? parseInt($(document).width()) : parseInt(screen.width);
        this.height = parseInt($(document).height()) < parseInt(screen.height) ? parseInt($(document).height()) : parseInt(screen.height);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getSize() {
        return new Vector2d(this.width, this.height);
    }
}

if (window.J2D === undefined) window.DeviceUtil = DeviceUtil;
