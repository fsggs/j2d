/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/d91880bd189a29b364cc6fd2a3af069f139c5f8a
 */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('j2d.fps', [], factory);
    } else {
        factory();
    }
}(global, function () {
    "use strict";

    var FPSMeter = function () {
        this.tmp_of_fps = 0;
        this.maxFPS = 60;
        this.tmp_of_time = Date.now();
    };

    FPSMeter.prototype.start = function (data) {
        this.maxFPS = data.frameLimit;
        if (this.fps === undefined) this.fps = data.frameLimit;
        this.tmp_of_fps += 1;
    };

    FPSMeter.prototype.end = function (data) {
        if (data.now - this.tmp_of_time >= 1000.0) {
            this.fps = this.tmp_of_fps;
            this.tmp_of_fps = 0;
            this.tmp_of_time = data.now;
        }
    };

    FPSMeter.prototype.getFPS = function () {
        return (this.fps > this.maxFPS) ? this.maxFPS : this.fps;
    };

    if (global.J2D !== undefined) global.FPSMeter = FPSMeter;
    return FPSMeter;
});
