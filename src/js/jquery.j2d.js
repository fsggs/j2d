/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

/*
 * TODO:: Events System
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jquery.j2d', [
            'jquery',
            'core/SceneManager',
            'core/MediaManager',
            'utils/DeviceUtil'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('core/SceneManager'),
            require('core/MediaManager'),
            require('utils/DeviceUtil')
        );
    } else {
        factory(
            root.jQuery,
            root.SceneManager,
            root.MediaManager,
            root.DeviceUtil
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, SceneManager, MediaManager, DeviceUtil) {
    "use strict";

    /**
     * @param {Element|jQuery} element
     * @param {J2D.defaults} data
     *
     * @constructor
     * @property {boolean} WebGL
     * @property {boolean} smoothing
     * @property {InputManager|null} io
     * @property {boolean} isPlay
     */
    var J2D = function J2D(element, data) {
        var j2d = this;

        /** @type {Element|jQuery} */
        this.element = element;

        /** @type J2D.defaults */
        this.data = data;

        /** @type DeviceUtil */
        this.device = new DeviceUtil();

        /** @type SceneManager */
        this.scene = new SceneManager(this);

        /** @type MediaManager */
        this.mediaManager = new MediaManager(this);

        Object.defineProperty(this, 'WebGL', {
            get: function () {
                return j2d.data.webGL;
            },
            set: function (value) {
                j2d.data.webGL = !!value;
                if (!!value && !j2d.data.webGL) {
                    j2d.element.addClass('WebGL');
                } else if (!value && j2d.data.webGL) {
                    j2d.element.removeClass('WebGL');
                }
            }
        });

        Object.defineProperty(this, 'smoothing', {
            get: function () {
                return j2d.data.smoothing;
            },
            set: function (value) {
                j2d.data.smoothing = !!value;
            }
        });

        Object.defineProperty(this, 'io', {
            get: function () {
                return j2d.data.io;
            },
            set: function (value) {
                return j2d.data.io = value
            }
        });

        Object.defineProperty(this, 'isPlay', {
            get: function () {
                return !j2d.data.pause;
            },
            set: function () {
            }
        });
    };

    J2D.defaults = {
        id: null,
        io: null,
        deltaTime: 0,
        pause: false,
        ready: false,

        frameLimit: 60,
        smoothing: true,

        webGL: false
    };

    /** +GameEngine **/
    J2D.prototype.start = function () {
        this.scene.start();
        this.trigger('start');
    };

    J2D.prototype.stop = function () {
        this.scene.stop();
        this.trigger('stop');
    };

    J2D.prototype.pause = function () {
        if (this.data.io) this.data.io.flush();
        this.data.pause = true;
        this.element.addClass('pause');
        this.trigger('pause');
    };

    J2D.prototype.resume = function () {
        this.element.removeClass('pause').focus();
        this.data.pause = false;
        if (this.data.io) this.data.io.flush();
        this.trigger('resume');
    };
    /** -GameEngine **/

    J2D.prototype.getSceneManager = function () {
        return this.scene;
    };

    J2D.prototype.getMediaManager = function () {
        return this.mediaManager;
    };

    J2D.prototype.getLayersManager = function () {
        return this.scene.layersManager;
    };

    J2D.prototype.getFrameManager = function () {
        return this.scene.frameManager;
    };

    J2D.prototype.getViewportManager = function () {
        return this.scene.viewportManager;
    };

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
        /**
         * @param {CanvasRenderingContext2D} context
         */
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

    (J2D.initPlugin = function () {
        if (window.j2dPlugin !== undefined) return null;
        window.j2dPlugin = {pluginInit: true};

        /**
         * @param {J2D.defaults} [options]
         * @returns {J2D|J2D[]|Array.<J2D>}
         */
        $.fn.j2d = function (options) {
            this.filter('div.canvas:not([guid])').each(function () {
                var options = $.extend(true, {}, J2D.defaults, options);

                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                options.id = guid;

                $(this).attr('guid', guid);
                var id = $(this).attr('id');
                if (typeof id === 'undefined' || id === false) {
                    $(this).attr('id', guid);
                }
                var tabIndex = $(this).attr('tabindex');
                if (typeof tabIndex === 'undefined' || tabIndex === false) {
                    $(this).attr('tabindex', '-1');
                }
                $(this).data('j2d', new J2D($(this), options)).addClass('j2d');
                $(this).click().focus();
            });

            var $array = [];
            this.filter('div.canvas[guid]').each(function () {
                $array.push($(this).data('j2d'));
            });

            return (1 === $array.length) ? $(this).data('j2d') : $array;
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
                $(this).data('j2d').device.onResize();
            });
            var fullScreen = isFullScreen();
            if (fullScreen) {
                $('div.canvas[guid].active').data('j2d').scene.resizeToFullPage(fullScreen);
            }
        });
    })();

    if (global.exports !== undefined) global.exports.J2D = J2D;
    if (global.J2D === undefined) global.J2D = J2D;
    return J2D;
}));
