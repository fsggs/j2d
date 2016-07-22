/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('loaders/AssetsLoader', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     * Assets Loader
     *
     * @class AssetsLoader
     * @exports module:loaders/AssetsLoader
     *
     * @constructor
     */
    var AssetsLoader = function () {
        this.progress = 0;
    };

    AssetsLoader.prototype.getProgress = function () {
        return this.progress;
    };

    AssetsLoader.prototype.load = function () {};
    AssetsLoader.prototype.isLoaded = function (index) {};
    AssetsLoader.prototype.dispose = function (index) {};

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.AssetsLoader = AssetsLoader;
    if (global.j2d !== undefined) global.j2d.loaders.AssetsLoader = AssetsLoader;
    return AssetsLoader;
}));
