/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license BSD, zlib
 * @version 0.1.5
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jquery.j2d', ['jquery', 'j2d.webGL2d', 'j2d.frame', 'j2d.scene', 'j2d.layers'], factory);
    } else {
        factory(root.jQuery, root.WebGL2D, null, null, null);
    }
}(global, function (jQuery, WebGL2D, FrameManager, Scene, LayersManager) {
    var $ = jQuery, J2D;
    'use strict';

    var defaults = {
        id: undefined,
        io: undefined,
        deltaTime: 0,
        pause: false,
        ready: false,

        frameLimit: 60,
        smoothing: true,

        window: window,

        webGL: false
    };

    J2D = function J2D(id, element, options) {
        this.id = id;
        this.element = element;
        this.options = options;

        this.options.id = this.id;

        this.layers = new LayersManager(this, WebGL2D);
        this.scene = new Scene(this);
    };

    /** +links getters **/
    J2D.prototype.getInfo = function () {
        return {
            'name': 'jquery.j2d',
            'version': '0.1.5',
            'site': 'https://github.com/fsggs/jquery.j2d',
            'info': 'jquery.j2d - jQuery plugin of the fork j2ds.',
            'author': 'DeVinterX, Skaner(j2ds)'
        };
    };

    J2D.prototype.getIO = function () {
        return this.options.io;
    };
    /** -links getters **/

    /** +GameEngine **/
    J2D.prototype.IOHandler = function (handler) {
        return this.options.io = handler;
    };

    J2D.prototype.setWindow = function (customWindow) {
        this.window = customWindow ? customWindow : window;
    };

    // старт игры
    J2D.prototype.start = function (engine, frameLimit) {
        var j2d = this;

        engine = engine || function () {
            j2d.element.html('Please init game engine function!');
            console.warn('Please init game engine function for ' + j2d.id + '!');
        };

        FrameManager.start(j2d.id, engine, {
            j2d: j2d,
            frameLimit: frameLimit
        });

        j2d.options.frameLimit = frameLimit;

        j2d.element.trigger('start');
    };

    J2D.prototype.stop = function () {
        //if(this.options.io) this.options.io.disable();
        FrameManager.stop(this.id);
        this.element.trigger('stop');
    };

    J2D.prototype.pause = function () {
        if (this.options.io) this.options.io.flush();
        this.options.pause = true;
        this.element.addClass('pause');
        this.element.trigger('pause');
    };

    J2D.prototype.resume = function () {
        this.element.removeClass('pause').focus();
        this.options.pause = false;
        if (this.options.io) this.options.io.flush();
        this.element.trigger('resume');
    };

    J2D.prototype.isPlay = function () {
        return !this.options.pause;
    };

    J2D.prototype.enableWebGL = function () {
        this.options.webGL = true;
        this.element.addClass('WebGL');
    };

    J2D.prototype.setSmoothing = function (value) {
        this.options.smoothing = !!value;
    };

    J2D.prototype.disableWebGL = function () {
        this.options.webGL = false;
        this.element.removeClass('WebGL');
    };

    J2D.prototype.setActiveEngine = function (engine) {
        var j2d = this;

        engine = engine || function () {
            j2d.element.html('Please set game engine function!');
            console.warn('Please set game engine function for ' + j2d.id + '!');
        };

        FrameManager.stop(j2d.id);

        FrameManager.start(j2d.id, engine, {
            j2d: j2d,
            frameLimit: j2d.options.frameLimit
        });
    };
    /** -GameEngine **/

    /** Device **/
    J2D.prototype.getDevice = function () {
        return this.device;
    };

    J2D.prototype.device = {
        width: parseInt($(document).width()) < parseInt(screen.width) ? parseInt($(document).width()) : parseInt(screen.width),
        height: parseInt($(document).height()) < parseInt(screen.height) ? parseInt($(document).height()) : parseInt(screen.height),

        resize: function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    };

    /** Vector **/
    J2D.prototype.vector = {
        vec2df: function (x, y) {
            return {x: x, y: y};
        },
        vec2di: function (x, y) {
            return {x: (x >> 0), y: (y >> 0)};
        }
    };

    /** Math **/
    J2D.math = {
        toInt: function (number) {
            return number >> 0;
        },
        randomColor: function (min, max, opacity) {
            return 'rgba('
                + J2D.math.random(min, max) + ', '
                + J2D.math.random(min, max) + ', '
                + J2D.math.random(min, max) + ', '
                + opacity + ')';
        },
        random: function (min, max, omitZero) {
            var random = (Math.floor(Math.random() * (max - min + 1) + min));
            return (omitZero && random == 0)
                ? J2D.math.random(min, max, omitZero)
                : random;
        },
        rad: function (number) {
            return number * (Math.PI / 180);
        }
    };

    J2D.prototype.math = J2D.math;

    /** Utils **/
    J2D.util = {
        disableSmoothing: function (context) {
            var chrome = window.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
            var version = chrome ? parseInt(chrome[2], 10) : false;

            context['imageSmoothingEnabled'] = false;
            context['mozImageSmoothingEnabled'] = false;
            context['oImageSmoothingEnabled'] = false;
            if (version && version <= 29) {
                context['webkitImageSmoothingEnabled'] = false;
            }
            context['msImageSmoothingEnabled'] = false;
        }
    };
    J2D.prototype.util = J2D.util;

    /** +Layers **/
    J2D.prototype.getLayers = function () {
        return this.layers;
    };
    /** -Layers **/

    /** +Scene **/
    J2D.prototype.getScene = function () {
        return this.scene;
    };
    /** -Scene **/

    J2D.initJQueryPlugin = function () {
        if (window.j2dPlugin !== undefined) return null;
        window.j2dPlugin = {pluginInit: true};

        $.fn.j2d = function (options) {
            this.filter('div.canvas:not([guid])').each(function () {
                var options = $.extend(true, {}, defaults, options);

                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                $(this).attr('guid', guid);
                var id = $(this).attr('id');
                if (typeof id === typeof undefined || id === false) {
                    $(this).attr('id', guid);
                }
                var tabIndex = $(this).attr('tabindex');
                if (typeof tabIndex === typeof undefined || tabIndex === false) {
                    $(this).attr('tabindex', '-1');
                }
                $(this).data('j2d', new J2D(guid, $(this), options)).addClass('j2d');
                $(this).click().focus();
            });

            var $array = [];
            this.filter('div.canvas[guid]').each(function () {
                $array.push($(this).data('j2d'));
            });

            if (1 === $array.length) {
                return $(this).data('j2d');
            } else {
                return $array;
            }
        };

        var isFullScreen = function () {
            return !!(document.webkitFullscreenElement
            || document.webkitCurrentFullScreenElement
            || document.mozFullScreenElement
            || document.msFullscreenElement
            );
        };

        $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function (e) {
            var fullScreen = isFullScreen();
            if (!fullScreen) {
                $('div.canvas[guid].active').data('j2d').scene.resizeToFullPage(fullScreen);
                $('div.canvas[guid]:not(.active)').toggle(!fullScreen);
            }
        });

        $(document).on('click', 'div.canvas[guid].pause', function () {
            $(this).data('j2d').resume();

            var current = this;
            $('div.canvas[guid]:not(.pause-disable):not(:focus)').each(function () {
                if (current !== this) $(this).removeClass('active').data('j2d').pause();
            });
            $('div.canvas[guid].active.pause-disable:not(:focus)').each(function () {
                if (current !== this) $(this).removeClass('active');
            });
        });

        $(document).on('click touch mouseenter', 'div.canvas[guid]:not(.resume-by-click):not(:focus)', function (e) {
            $(this).addClass('active').focus().data('j2d').resume();

            var current = this;
            $('div.canvas[guid]:not(.pause-disable):not(:focus)').each(function () {
                if (current !== this) $(this).removeClass('active').data('j2d').pause();
            });
            $('div.canvas[guid].active.pause-disable:not(:focus)').each(function () {
                if (current !== this) $(this).removeClass('active');
            });
        });

        $(window).on('focus', function () {
            $('div.canvas[guid].active').each(function () {
                $(this).data('j2d').resume();
            });
        }).on('blur', function () {
            $('div.canvas[guid]').each(function () {
                $(this).data('j2d').pause();
            });
        });

        $(window).on('resize', function () {
            $('div.canvas[guid]').each(function () {
                $(this).data('j2d').device.resize();
            });
            var fullScreen = isFullScreen();
            if (fullScreen) {
                $('div.canvas[guid].active').data('j2d').scene.resizeToFullPage(fullScreen);
            }
        });

        FrameManager.pulse();
    };

    return J2D;
});
