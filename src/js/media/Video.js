(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('media/Video', ['jquery', 'utils/ArrayMap'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('utils/ArrayMap'));
    } else {
        factory(root.jQuery, root.ArrayMap);
    }
}(typeof window !== 'undefined' ? window : global, function ($, ArrayMap) {
    "use strict";

    var Video = function () {

    };
    
    if (global.exports !== undefined) global.exports.Video = Video;
    if (global.J2D !== undefined) global.Video = Video;
    return Video;
}));
