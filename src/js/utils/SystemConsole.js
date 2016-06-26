/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/SystemConsole', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    var SystemConsole = function () {
        this.css = function (color) {
            return 'background: ' + color + ';' +
                'background-repeat: no-repeat;' +
                'color: #1df9a8;' +
                'line-height: 16px' +
                'padding: 3px 0';
        };

        this.link = function (color) {
            return 'background: ' + color + ';' +
                'background-repeat: no-repeat;' +
                'font-size: 12px;' +
                'color: #446d96;' +
                'line-height: 14px';
        };
    };

    SystemConsole.prototype.logSystem = function (message, link) {
        return console.log("%c %c %c %s %c %c %c %c%s",
            this.css('#5C6166'), this.css('#4F5357'),
            this.css('#313335'), message,
            this.css('#4F5357'), this.css('#5C6166'),
            this.link('none'), this.link('none'), link
        );
    };

    SystemConsole.prototype.log = function (message, level) {
        var css = '';
        if (typeof level === 'string') level = level.toLowerCase();
        switch (level) {
            case 'info':
                level = 'INFO';
                css = 'background: #308AE4; color: #fff; padding: 1px 4px';
                break;
            case 'warn':
            case 'warning':
                level = 'WARNING';
                css = 'background: #f7a148; color: #fff; padding: 1px 4px';
                break;
            case 'error':
                level = 'ERROR';
                css = 'background: #DB5252; color: #fff; padding: 1px 4px';
                break;
            case 'network':
                level = 'NETWORK';
                css = 'background: #7D2998; color: #fff; padding: 1px 4px';
                break;
            case 'debug':
            case undefined:
            default:
                level = 'DEBUG';
                css = 'background: #ADADAD; color: #fff; padding: 1px 4px';
        }
        return console.log("%c%s", css, level, message);
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.SystemConsole = SystemConsole;
    if (global.j2d === undefined) global.j2d.utils.SystemConsole = SystemConsole;
    return SystemConsole;
}));
