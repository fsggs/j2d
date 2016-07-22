/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

/*
 * TODO:: Events System
 */

/**
 * @module "j2d"
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('j2d', [
            'jquery',
            'core/SceneManager',
            'utils/DeviceUtil',
            'utils/ObjectUtil',
            'utils/UUID',
            'utils/SystemConsole'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('core/SceneManager'),
            require('utils/DeviceUtil'),
            require('utils/ObjectUtil'),
            require('utils/UUID'),
            require('utils/SystemConsole')
        );
    } else {
        factory(
            root.jQuery,
            root.j2d.core.SceneManager,
            root.j2d.utils.DeviceUtil,
            root.j2d.utils.ObjectUtil,
            root.j2d.utils.UUID,
            root.j2d.utils.SystemConsole
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, SceneManager, DeviceUtil, ObjectUtil, UUID, Log) {
    "use strict";

    /**
     * @class EngineJ2D
     * @exports module:"j2d"
     * @alias module:"j2d"
     *
     * @param {Element|jQuery} element
     * @param {EngineJ2D.defaults} data
     *
     * @constructor
     * @property {boolean} WebGL // TODO:: To scene
     * @property {boolean} smoothing // TODO:: To scene
     * @property {InputManager|null} io
     * @property {MediaManager|null} media
     * @property {boolean} isPlay
     */
    var EngineJ2D = function (element, data) {
        var j2d = this;

        /** @type {Element|jQuery} */
        this.element = element;

        /** @type EngineJ2D.defaults */
        this.data = data;

        /** @type DeviceUtil */
        this.device = new DeviceUtil();

        /** @type SceneManager */
        this.scene = new SceneManager(this);

        /** @type SystemConsole */
        this.Log = new Log();

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

        Object.defineProperty(this, 'media', {
            get: function () {
                return j2d.data.media;
            },
            set: function (value) {
                return j2d.data.media = value
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

    EngineJ2D.VERSION = '0.2.0-dev';

    EngineJ2D.defaults = {
        /** @type string|null */
        id: null,
        io: null,
        media: null,
        deltaTime: 0,
        pause: false,
        ready: false,

        frameLimit: 60,
        smoothing: true,

        webGL: false
    };

    /** +GameEngine **/
    EngineJ2D.prototype.start = function () {
        this.scene.start();
        this.trigger('start');
    };

    EngineJ2D.prototype.stop = function () {
        this.scene.stop();
        this.trigger('stop');
    };

    // TODO:: add MediaManager
    EngineJ2D.prototype.pause = function () {
        if (this.data.io) this.data.io.flush();
        this.data.pause = true;
        this.element.addClass('pause');
        this.trigger('pause');
    };

    // TODO:: add MediaManager
    EngineJ2D.prototype.resume = function () {
        this.element.removeClass('pause').focus();
        this.data.pause = false;
        if (this.data.io) this.data.io.flush();
        this.trigger('resume');
    };
    /** -GameEngine **/

    /** @returns {SceneManager} */
    EngineJ2D.prototype.getSceneManager = function () {
        return this.scene;
    };

    /** @returns {LayersManager} */
    EngineJ2D.prototype.getLayersManager = function () {
        return this.scene.layersManager;
    };

    /** @returns {FrameManager} */
    EngineJ2D.prototype.getFrameManager = function () {
        return this.scene.frameManager;
    };

    /** @returns {ViewportManager} */
    EngineJ2D.prototype.getViewportManager = function () {
        return this.scene.viewportManager;
    };

    /** @returns {GameStatesManager} */
    EngineJ2D.prototype.getGameStatesManager = function () {
        return this.scene.gameStatesManager;
    };

    EngineJ2D.prototype.on = function () {
    };
    EngineJ2D.prototype.once = function () {
    };
    EngineJ2D.prototype.off = function () {
    };
    EngineJ2D.prototype.trigger = function () {
    };

    EngineJ2D.prototype.log = function (message, level) {
        this.Log.log(message, level);
    };

    /** Utils **/
    EngineJ2D.util = {
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
    EngineJ2D.prototype.util = EngineJ2D.util;

    /* ------------------------------ Plugin ------------------------------ */

    (EngineJ2D.initPlugin = function () {
        if (window.j2dPlugin !== undefined) return null;
        window.j2dPlugin = {pluginInit: true};

        (new Log()).logSystem('j2D v.' + EngineJ2D.VERSION, 'https://github.com/fsggs/j2d');
        /**
         * @param {EngineJ2D.defaults} [options]
         * @returns {EngineJ2D|EngineJ2D[]|Array.<EngineJ2D>}
         */
        $.fn.j2d = function (options) {
            this.filter('div.canvas:not([guid])').each(function () {
                var options = ObjectUtil.extend(true, {}, EngineJ2D.defaults, options);

                options.id = UUID.generate();

                $(this).attr('guid', options.id);
                var id = $(this).attr('id');
                if (typeof id === 'undefined' || id === false) {
                    $(this).attr('id', options.id);
                }
                var tabIndex = $(this).attr('tabindex');
                if (typeof tabIndex === 'undefined' || tabIndex === false) {
                    $(this).attr('tabindex', '-1');
                }
                $(this).data('j2d', new EngineJ2D($(this), options)).addClass('j2d');
                $(this).click().focus();
            });

            var $array = [];
            this.filter('div.canvas[guid]').each(function () {
                $array.push($(this).data('j2d'));
            });

            return (1 === $array.length) ? $(this).data('j2d') : $array;
        };

        var firefox = global.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
        var version = firefox ? parseInt(firefox[2], 10) : false;

        var isFullScreen = function () {
            //noinspection JSUnresolvedVariable
            return !!(document.webkitFullscreenElement
                || document.webkitCurrentFullScreenElement
                || (version && version < 47) ? document.mozFullScreenElement : document.fullscreenElement
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

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.EngineJ2D = EngineJ2D;
    if (global.j2d !== undefined) global.j2d.EngineJ2D = EngineJ2D;
    return EngineJ2D;
}));
