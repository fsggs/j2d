/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jquery.j2d', [
            'jquery',
            'core/WebGL2D',
            'core/FrameManager',
            'core/SceneManager',
            'core/LayersManager'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('core/WebGL2D'),
            require('core/FrameManager'),
            require('core/SceneManager'),
            require('core/LayersManager')
        );
    } else {
        factory(
            root.jQuery,
            root.WebGL2D,
            root.FrameManager,
            root.SceneManager,
            root.LayersManager
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, WebGL2D, FrameManager, SceneManager, LayersManager) {
    "use strict";

    var defaults = {
        id: undefined,
        io: undefined,
        deltaTime: 0,
        pause: false,
        ready: false,

        frameLimit: 60,
        smoothing: true,

        webGL: false
    };

    var J2D = function J2D(element, data) {
        this.element = element;
        this.data = data;

        this.layers = new LayersManager(this, WebGL2D);
        this.scene = new SceneManager(this, WebGL2D);
    };

    J2D.prototype.getIOHandler = function () {
        return this.data.io;
    };
    /** -links getters **/

    /** +GameEngine **/
    J2D.prototype.IOHandler = function (handler) {
        return this.data.io = handler;
    };

    // старт игры
    J2D.prototype.start = function (engine, frameLimit) {
        var j2d = this;

        engine = engine || function () {
                j2d.element.html('Please init game engine function!');
                console.warn('Please init game engine function for ' + j2d.data.id + '!');
            };

        FrameManager.start(j2d.data.id, engine, {
            j2d: j2d,
            frameLimit: frameLimit
        });

        j2d.data.frameLimit = frameLimit;

        j2d.element.trigger('start');
    };

    J2D.prototype.stop = function () {
        FrameManager.stop(this.data.id);
        this.element.trigger('stop');
    };

    J2D.prototype.pause = function () {
        if (this.data.io) this.data.io.flush();
        this.data.pause = true;
        this.element.addClass('pause');
        this.element.trigger('pause');
    };

    J2D.prototype.resume = function () {
        this.element.removeClass('pause').focus();
        this.data.pause = false;
        if (this.data.io) this.data.io.flush();
        this.element.trigger('resume');
    };

    J2D.prototype.isPlay = function () {
        return !this.data.pause;
    };

    J2D.prototype.enableWebGL = function () {
        this.data.webGL = true;
        this.element.addClass('WebGL');
    };

    J2D.prototype.setSmoothing = function (value) {
        this.data.smoothing = !!value;
    };

    J2D.prototype.disableWebGL = function () {
        this.data.webGL = false;
        this.element.removeClass('WebGL');
    };

    J2D.prototype.setGameState = function (engine) {
        var j2d = this;

        engine = engine || function () {
                j2d.element.html('Please set game engine function!');
                console.warn('Please set game engine function for ' + j2d.data.id + '!');
            };

        FrameManager.stop(j2d.data.id);

        FrameManager.start(j2d.data.id, engine, {
            j2d: j2d,
            frameLimit: j2d.data.frameLimit
        });
    };
    /** -GameEngine **/

    /** +Layers **/
    J2D.prototype.getLayerManager = function () {
        return this.layers;
    };
    /** -Layers **/

    /** +Scene **/
    J2D.prototype.getSceneManager = function () {
        return this.scene;
    };
    /** -Scene **/

    J2D.prototype.on = function () {
    };
    J2D.prototype.once = function () {
    };
    J2D.prototype.off = function () {
    };
    J2D.prototype.trigger = function () {
    };

    /** Utils **/
    J2D.util = {
        disableSmoothing: function (context) {
            var chrome = global.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
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

    /* ------------------------------ Plugin ------------------------------ */

    J2D.initPlugin = function () {
        if (window.j2dPlugin !== undefined) return null;
        window.j2dPlugin = {pluginInit: true};

        $.fn.j2d = function (options) {
            this.filter('div.canvas:not([guid])').each(function () {
                var options = $.extend(true, {}, defaults, options);

                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                options.id = guid;

                $(this).attr('guid', guid);
                var id = $(this).attr('id');
                if (typeof id === typeof undefined || id === false) {
                    $(this).attr('id', guid);
                }
                var tabIndex = $(this).attr('tabindex');
                if (typeof tabIndex === typeof undefined || tabIndex === false) {
                    $(this).attr('tabindex', '-1');
                }
                $(this).data('j2d', new J2D($(this), options)).addClass('j2d');
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
            //noinspection JSUnresolvedVariable
            return !!(document.webkitFullscreenElement
                || document.webkitCurrentFullScreenElement
                || document.mozFullScreenElement
                || document.msFullscreenElement
            );
        };

        $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function () {
            var fullScreen = isFullScreen();
            if (!fullScreen) {
                // $('div.canvas[guid].active').data('j2d').scene.resizeToFullPage(fullScreen); TODO::
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

        $(document).on('click touch mouseenter', 'div.canvas[guid]:not(.resume-by-click):not(:focus)', function () {
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
                // $('div.canvas[guid].active').data('j2d').scene.resizeToFullPage(fullScreen); TODO::
            }
        });

        FrameManager.pulse();
    };

    global.J2D = (global.J2D === undefined) ? J2D : undefined;

    return J2D;
}));
