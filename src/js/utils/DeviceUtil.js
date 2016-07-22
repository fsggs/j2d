/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/DeviceUtil', ['utils/Vector2dInteger'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/Vector2dInteger'));
    } else {
        factory(root.j2d.utils.Vector2dInteger);
    }
}(typeof window !== 'undefined' ? window : global, function (Vector2dInteger) {
    "use strict";

    /**
     * Class utility for get system browser window size
     * 
     * @class DeviceUtil
     * @exports module:utils/DeviceUtil
     * 
     * @constructor
     */
    var DeviceUtil = function () {
        var documentWidth = parseInt(Math.max(
            document.documentElement['clientWidth'],
            document.body['scrollWidth'],
            document.documentElement['scrollWidth'],
            document.body['offsetWidth'],
            document.documentElement['offsetWidth']
        ));

        var documentHeight = parseInt(Math.max(
            document.documentElement['clientHeight'],
            document.body['scrollHeight'],
            document.documentElement['scrollHeight'],
            document.body['offsetHeight'],
            document.documentElement['offsetHeight']
        ));

        this.width = documentWidth < parseInt(screen.width) ? documentWidth : parseInt(screen.width);
        this.height = documentHeight < parseInt(screen.height) ? documentHeight : parseInt(screen.height);
    };

    /**
     * @returns {DeviceUtil}
     */
    DeviceUtil.prototype.onResize = function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        return this;
    };

    /**
     * @returns {number}
     */
    DeviceUtil.prototype.getWidth = function () {
        return this.width;
    };

    /**
     * @returns {number}
     */
    DeviceUtil.prototype.getHeight = function () {
        return this.height;
    };

    /**
     * @returns {Vector2d}
     */
    DeviceUtil.prototype.getSize = function () {
        return new Vector2dInteger(this.width, this.height);
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.DeviceUtil = DeviceUtil;
    if (global.j2d !== undefined) global.j2d.utils.DeviceUtil = DeviceUtil;
    return DeviceUtil;
}));
