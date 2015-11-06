define([], function () {
    "use strict";

    var FPSMeter = function (j2d) {
        this.j2d = j2d;
        this.fps = j2d.options.framelimit;
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
