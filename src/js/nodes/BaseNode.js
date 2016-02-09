/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/BaseNode', ['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(root.jQuery);
    }
}(typeof window !== 'undefined' ? window : global, function ($) {
    "use strict";

    /**
     * @constructor
     */
    var BaseNode = function () {
        this.data = {};
    };

    if (global.J2D !== undefined) global.BaseNode = BaseNode;
    return BaseNode;
}));
