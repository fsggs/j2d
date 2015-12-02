/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.1
 * @see https://github.com/SkanerSoft/J2ds/commit/d91880bd189a29b364cc6fd2a3af069f139c5f8a
 */

define('j2d.fps', [], function () {
    "use strict";

    var FPSMeter = function () {
        this.tmp_of_fps = 1;
        this.tmp_of_time = Date.now();
    };

    FPSMeter.prototype.start = function (data) {
        this.fps = data.frameLimit;
        this.tmp_of_fps += 1;
    };

    FPSMeter.prototype.end = function (data) {
        if (data.now - this.tmp_of_time >= 1000.0) {
            this.fps = this.tmp_of_fps;
            this.tmp_of_fps = 1;
            this.tmp_of_time = data.now;
        }
    };

    FPSMeter.prototype.getFPS = function () {
        return (this.fps);
    };

    return FPSMeter;
});
