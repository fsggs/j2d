/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.1
 * @see https://github.com/SkanerSoft/J2ds/commit/d91880bd189a29b364cc6fd2a3af069f139c5f8a
 */

define([], function () {
    "use strict";

    var FPSMeter = function (j2d) {
        this.j2d = j2d;
        this.fps = j2d.options.frameLimit;
        this.tmp_of_fps = 1;
        this.tmp_of_time = Date.now();
    };

    FPSMeter.prototype.start = function () {
        this.tmp_of_fps += 1;
    };

    FPSMeter.prototype.end = function () {
        if (this.j2d.options.now - this.tmp_of_time >= 1000) {
            this.fps = this.tmp_of_fps;
            this.tmp_of_fps = 1;
            this.tmp_of_time = this.j2d.options.now;
        }
    };

    FPSMeter.prototype.getFPS = function () {
        return (this.fps - 1);
    };

    return FPSMeter;
});
