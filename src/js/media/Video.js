/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('media/Video', ['utils/ArrayMap'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/ArrayMap'));
    } else {
        factory(root.ArrayMap);
    }
}(typeof window !== 'undefined' ? window : global, function (ArrayMap) {
    "use strict";


    /**
     * @class Video
     * @exports module:media/Video
     *
     * @constructor
     */
    var Video = function () {

    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Video = Video;
    if (global.j2d !== undefined) global.j2d.media.Video = Video;
    return Video;
}));
