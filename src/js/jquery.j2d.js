/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jquery.j2d', ['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(root.jQuery);
    }
}(typeof window !== 'undefined' ? window : global, function ($) {
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

    var J2D = function () {

    };

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

        //FrameManager.pulse();
    };

    window.J2D = (window.J2D === undefined) ? J2D : undefined;

    return J2D;
}));
