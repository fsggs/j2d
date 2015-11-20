/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */
!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jquery.j2d', ['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
}(global, function (jQuery) {
    var $ = jQuery, J2D;
    'use strict';

    var defaults = {
        vector: {},
        math: {},
        dom: {},
        now: 0,
        dt: 0,
        io: undefined,
        pause: false,
        frameLimit: 60,
        sceneStartTime: 0,
        sceneSkipTime: 0,
        engine: false,
        ready: false,
        window: window,

        webGL: false
    };

    J2D = function J2D(element, options) {
        var j2d = this;

        j2d.element = element;
        j2d.options = options;

        j2d.init();

        j2d.gameEngine = function () {
            j2d.options.now = Date.now();

            setTimeout(function () {
                if (!j2d.options.pause) {
                    if (j2d.options.io) {
                        j2d.options.io.update();
                    }
                    j2d.options.dt = (j2d.options.now - j2d.options.lastTime) / 100.0;
                    if (j2d.options.dt > j2d.options.sceneSkipTime) {
                        j2d.options.dt = 0;
                    }
                    j2d.options.sceneStartTime = j2d.options.now;
                    setTimeout(j2d.options.engine, 0);
                    j2d.options.lastTime = j2d.options.now;
                    if (j2d.options.io) {
                        j2d.options.io.clear();
                    }
                }
                nextJ2dsGameStep(j2d.gameEngine);
            }, (j2d.options.frameLimit < 60 ? j2d.options.sceneSkipTime : 0));
        };

        var nextJ2dsGameStep = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / j2d.options.frameLimit);
                };
        })();
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
    J2D.prototype.init = function () {
        if (this.layers) {
            this.layers.parent = this;
        }
        if (this.scene) {
            this.scene.parent = this;
        }
        delete this.init;
    };

    J2D.prototype.IOHandler = function (handler) {
        return this.options.io = handler;
    };

    J2D.prototype.setWindow = function (customWindow) {
        this.window = customWindow ? customWindow : window;
    };

    // старт игры
    J2D.prototype.start = function (engine, frameLimit) {
        var j2d = this;

        j2d.options.engine = engine || function () {
            j2d.element.html('Пожалуйста, инициализируйте игровую функцию!');
        };
        j2d.options.frameLimit = frameLimit || 60;
        j2d.options.sceneSkipTime = 1000.0 / j2d.options.frameLimit;
        j2d.options.lastTime = Date.now();
        j2d.options.dt = 0;
        j2d.options.sceneStartTime = j2d.options.lastTime;

        j2d.gameEngine();
    };

    J2D.prototype.pause = function () {
        this.options.pause = true;
        this.element.addClass('pause');
    };

    J2D.prototype.resume = function () {
        this.options.pause = false;
        this.element.removeClass('pause').focus();
    };

    J2D.prototype.isPlay = function () {
        return !this.options.pause;
    };

    J2D.prototype.enableWebGL = function () {
        this.options.webGL = true;
    };

    J2D.prototype.setActiveEngine = function (engine) {
        this.options.engine = engine;
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
    J2D.prototype.math = {
        toInt: function (number) {
            return number >> 0;
        },
        randomColor: function (min, max, opacity) {
            return 'rgba(' + this.random(min, max) + ', ' + this.random(min, max) + ', ' + this.random(min, max) + ', ' + opacity + ')';
        },
        random: function (min, max, omitZero) {
            var random = (Math.floor(Math.random() * (max - min + 1) + min));
            return (omitZero && random == 0) ? this.random(min, max, omitZero) : random;
        },
        rad: function (number) {
            return number * (Math.PI / 180);
        }
    };

    /** +Layers **/
    J2D.prototype.getLayers = function () {
        return this.layers;
    };

    J2D.prototype.layers = {
        parent: undefined,
        list: {}
    };

    J2D.prototype.layers.getLayer = function (id) {
        return this.list[id];
    };
    J2D.prototype.layers.add = function (id, zIndex) {
        if (this.list[id]) {
            return false;
        }

        var layer = {};
        var j2d = this.parent;

        layer.layerName = id;
        layer.canvas = document.createElement('canvas');
        layer.canvas.width = j2d.scene.width;
        layer.canvas.height = j2d.scene.height;
        layer.width = j2d.scene.width;
        layer.height = j2d.scene.height;
        layer.context = layer.canvas.getContext('2d');
        layer.context.shadowColor = 'rgba(0,0,0,0)';
        layer.canvas.style.zIndex = 1000 + zIndex;
        layer.canvas.style.position = 'fixed';
        layer.canvas.style.left = '0';
        layer.canvas.style.top = '0';
        layer.canvas.id = id;
        layer.opacity = 1;
        layer.angle = 0;
        layer.visible = 1;

        layer.onContext = function (callback) {
            callback(this.context);
        };

        layer.fill = function (color) {
            this.context.fillStyle = color;
            this.context.fillRect(0, 0, this.width, this.height);
        };

        layer.setOpacity = function (opacity) {
            this.canvas.style.opacity = opacity;
            this.opacity = opacity;
        };

        layer.getOpacity = function () {
            return this.opacity;
        };

        layer.setVisible = function (visible) {
            if (visible) {
                this.canvas.style.display = 'block';
                this.visible = true;
            } else {
                this.canvas.style.display = 'none';
                this.visible = false;
            }
        };

        layer.isVisible = function () {
            return this.visible;
        };

        layer.setIndex = function (zIndex) {
            this.canvas.style.zIndex = 1000 + zIndex;
        };

        layer.clear = function () {
            this.context.clearRect(0, 0, this.width, this.height);
        };

        layer.clearNode = function (node) {
            if (node.isLookScene()) {
                this.context.clearRect(node.pos.x - j2d.scene.viewport.x, node.pos.y - j2d.scene.viewport.y, node.size.x, node.size.y);
            }
        };

        layer.clearRect = function (pos, size) {
            this.context.clearRect(pos.x - j2d.scene.viewport.x, pos.y - j2d.scene.viewport.y, size.x, size.y);
        };

        this.list[id] = layer;

        if (j2d.options.ready) {
            j2d.element.append(this.list[id].canvas);
        }

        return layer;
    };
    /** -Layers **/

    /** +Scene **/
    J2D.prototype.getScene = function () {
        return this.scene;
    };

    J2D.prototype.scene = {
        parent: undefined,
        enableFullscreen: false,
        layerName: 'sceneNode',
        layers: (parent.layers) ? parent.layers : {}
    };

    J2D.prototype.scene.async = function (callback, data) {
        setTimeout(callback.call(callback, data), 0);
    };

    J2D.prototype.scene.setGameState = function (engine) {
        this.parent.setActiveEngine(engine);
        this.parent.element.trigger('changedGameState');
    };

    J2D.prototype.scene.start = function (engine, frameLimit) {
        if (this.parent.options.io) {
            this.parent.options.io.init();
        }
        this.parent.element.trigger('beforeStart');
        this.parent.start(engine, frameLimit);
        this.parent.element.trigger('afterStart');
    };

    J2D.prototype.scene.resizeToFullScreen = function (fullscreen) {
        var j2d = this.parent;
        var scene = this;

        var layer;
        var tmpCanvas = document.createElement('canvas'); // Нужны для копирования содержимого
        var tmpContext = tmpCanvas.getContext('2d');      // При изменении размера
        if (fullscreen) {
            scene.originalWidth = scene.width;
            scene.originalHeight = scene.height;
            scene.width = j2d.device.width;
            scene.height = j2d.device.height;
            for (var i in j2d.layers.list) {
                layer = j2d.layers.list[i];
                tmpCanvas.width = layer.width;
                tmpCanvas.height = layer.height;
                tmpContext.drawImage(layer.canvas, 0, 0);
                layer.canvas.width = scene.width;
                layer.canvas.height = scene.height;
                layer.width = scene.width;
                layer.height = scene.height;
                layer.context.drawImage(tmpCanvas, 0, 0, layer.width, layer.height);
            }
            scene.enableFullscreen = true;
        } else {
            scene.width = scene.originalWidth;
            scene.height = scene.originalHeight;
            for (var i in j2d.layers.list) {
                layer = j2d.layers.list[i];
                layer.width = scene.originalWidth;
                layer.height = scene.originalHeight;
                layer.canvas.width = scene.originalWidth;
                layer.canvas.height = scene.originalHeight;
            }
            scene.enableFullscreen = false;
        }
    };

    J2D.prototype.scene.scaleToFullScreen = function (fullscreen) {
        var layer, i;
        if (fullscreen) {
            for (i in this.parent.layers.list) {
                if (this.parent.layers.list.hasOwnProperty(i)) {
                    layer = this.parent.layers.list[i].canvas;
                    layer.style.width = this.parent.device.width + 'px';
                    layer.style.height = this.parent.device.height + 'px';
                }
            }
            this.enableFullscreen = true;
            this.parent.element.width(this.parent.device.width).height(this.parent.device.height);
        } else {
            for (i in this.parent.layers.list) {
                if (this.parent.layers.list.hasOwnProperty(i)) {
                    layer = this.parent.layers.list[i].canvas;
                    layer.style.width = this.width + 'px';
                    layer.style.height = this.height + 'px';
                }
            }
            this.enableFullscreen = false;
            this.parent.element.width(this.width).height(this.height);
        }
    };

    J2D.prototype.scene.toggleFullScreen = function (j2d, data) {
        if (data === undefined) {
            data = {fullscreen: undefined};
        }
        if (!j2d.scene.enableFullscreen || data.fullscreen) {
            j2d.scene.resizeToFullScreen(true);
        } else {
            j2d.scene.resizeToFullScreen(false);
        }
    };

    // Устанавливает позицию для камеры
    J2D.prototype.scene.setViewPosition = function (position) {
        this.parent.scene.viewport.x = position.x - Math.ceil(this.parent.scene.width / 2);
        this.parent.scene.viewport.y = position.y - Math.ceil(this.parent.scene.height / 2);
    };

    //! Движение "камеры" вслед за объектом
    J2D.prototype.scene.setViewFocus = function (id, offset) {
        this.parent.scene.viewport.x = id.getPosition().x - Math.ceil(this.parent.scene.width / 2) + (offset ? offset.x : 0);
        this.parent.scene.viewport.y = id.getPosition().y - Math.ceil(this.parent.scene.height / 2) + (offset ? offset.y : 0);
    };

    //! Движение "камеры"
    J2D.prototype.scene.viewMove = function (position) {
        this.parent.scene.viewport.x += position.x;
        this.parent.scene.viewport.y += position.y;
    };

    //! Очистка отрисованного предыдущего кадра сцены
    J2D.prototype.scene.clear = function () {
        this.getLayer().clear();
    };

    J2D.prototype.scene.getLayer = function () {
        return this.parent.layers.getLayer('sceneNode');
    };

    // инициализация сцены
    J2D.prototype.scene.init = function (width, heigth) {
        var j2d = this.parent;
        j2d.element.trigger('beforeInit');

        this.width = this.originalWidth = width;
        this.height = this.originalHeight = heigth;

        this.parent.element.width(width).height(heigth);

        j2d.layers.add('sceneNode', 0);

        this.context = j2d.layers.getLayer('sceneNode').context;
        this.canvas = j2d.layers.getLayer('sceneNode').canvas;
        this.visible = true;

        this.cancelClear = false;

        /* Вид "камеры" */
        this.viewport = j2d.vector.vec2df(0, 0);

        j2d.element.trigger('afterInit');

        $(window).ready(function () {
            for (var i in j2d.layers.list) {
                if (j2d.layers.list.hasOwnProperty(i)) {
                    j2d.element.append(j2d.layers.getLayer(i).canvas);
                }
            }
            j2d.options.ready = true;
            j2d.element.trigger('ready');
        });
    };
    /** -Scene **/

    J2D.initJQueryPlugin = function () {
        $.fn.j2d = function (options) {
            options = $.extend(true, {}, defaults, options);

            this.filter('div.canvas:not([guid])').each(function () {
                $(this).data('j2d', new J2D($(this), options)).addClass('j2d');
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
                $(this).focus();
            });

            if (1 === $(this).length) {
                return $(this).data('j2d');
            }
        };

        $(document).on('click', 'div.canvas[guid].pause', function () {
            $(this).data('j2d').resume();
        });

        $(window).on('focus', function () {
            $('div.canvas[guid]').each(function () {
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
        });
    };

    return J2D;
});
