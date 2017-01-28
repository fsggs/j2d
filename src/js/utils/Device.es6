import Vector2dInteger from "utils/Vector2dInteger";
/**
 * Class utility for get system browser window size
 *
 * @class Device
 * @exports module:utils/Device
 *
 * @constructor
 */
export default class Device {
    constructor() {
        let documentWidth = parseInt(Math.max(
            document.documentElement['clientWidth'],
            document.body['scrollWidth'],
            document.documentElement['scrollWidth'],
            document.body['offsetWidth'],
            document.documentElement['offsetWidth']
        ));

        let documentHeight = parseInt(Math.max(
            document.documentElement['clientHeight'],
            document.body['scrollHeight'],
            document.documentElement['scrollHeight'],
            document.body['offsetHeight'],
            document.documentElement['offsetHeight']
        ));

        this.width = documentWidth < parseInt(screen.width) ? documentWidth : parseInt(screen.width);
        this.height = documentHeight < parseInt(screen.height) ? documentHeight : parseInt(screen.height);
    }

    /**
     * @returns {Device}
     */
    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        return this;
    }

    /**
     * @returns {number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * @returns {number}
     */
    getHeight() {
        return this.height;
    }

    /**
     * @returns {Vector2d}
     */
    getSize() {
        return new Vector2dInteger(this.width, this.height);
    }
}
