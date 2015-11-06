/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.0
 * @see https://github.com/SkanerSoft/J2ds/commit/81c85984b36cfd7ff413577737e10e8a81b0263c
 */
!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
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
        framelimit: 60,
        sceneStartTime: 0,
        sceneSkipTime: 0,
        engine: false,
        ready: false,
        window: window
    };

    J2D = function J2D(element, options) {
        var j2d = this;

        j2d.element = element;
        j2d.options = options;

        j2d.init();

        j2d.gameEngine = function () {
            j2d.options.now = Date.now();

            setTimeout(function () {
                //j2ds.input.upd();
                j2d.options.dt = (j2d.options.now - j2d.options.lastTime) / 100.0;
                if (j2d.options.dt > j2d.options.sceneSkipTime) {
                    j2d.options.dt = 0;
                }
                j2d.options.sceneStartTime = j2d.options.now;
                j2d.options.engine();
                j2d.options.lastTime = j2d.options.now;
                //j2d.input.keyPress = [];
                //j2d.input.keyUp = [];

                nextJ2dsGameStep(j2d.gameEngine);
            }, (j2d.options.framelimit < 60 ? j2d.options.sceneSkipTime : 0));
        };

        var nextJ2dsGameStep = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / j2d.options.framelimit);
                };
        })();
    };

    /** +GameEngine **/
    J2D.prototype.init = function () {
        this.layers.parent = this;
        this.scene.parent = this;
        delete this.init;
    };

    J2D.prototype.setWindow = function (customWindow) {
        this.window = customWindow ? customWindow : window;
    };

    // старт игры
    J2D.prototype.start = function (engine, framelimit) {
        var j2d = this;

        j2d.options.engine = engine || function () {
            j2d.element.html('Пожалуйста, инициализируйте игровую функцию!');
        };
        j2d.options.framelimit = framelimit || 60;
        j2d.options.sceneSkipTime = 1000.0 / j2d.options.framelimit;
        j2d.options.lastTime = Date.now();
        j2d.options.dt = 0;
        j2d.options.sceneStartTime = j2d.options.lastTime;

        j2d.gameEngine();
    };

    J2D.prototype.setActiveEngine = function (engine) {
        this.options.engine = engine;
    };
    /** -GameEngine **/

    /** Device **/
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
        layer.canvas.style.left = '0px';
        layer.canvas.style.top = '0px';
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
    J2D.prototype.scene = {
        parent: undefined,
        layerName: 'sceneNode',
        layers: (parent.layers) ? parent.layers : {}
    };

    J2D.prototype.scene.setGameState = function (engine) {
        this.parent.setActiveEngine(engine);
        this.parent.element.trigger('changedGameState');
    };

    J2D.prototype.scene.start = function (engine, framelimit) {
        //j2ds.input.init();
        this.parent.element.trigger('beforeStart');
        this.parent.start(engine, framelimit);
        this.parent.element.trigger('afterStart');
    };

    J2D.prototype.scene.fullScreen = function (fullscreen) {
        var layer, i;
        if (fullscreen) {
            for (i in this.parent.layers.list) {
                if (this.parent.layers.list.hasOwnProperty(i)) {
                    layer = this.parent.layers.list[i].canvas;
                    layer.style.width = this.parent.device.width + 'px';
                    layer.style.height = this.parent.device.height + 'px';
                }
            }
        } else {
            for (i in this.parent.layers.list) {
                if (this.parent.layers.list.hasOwnProperty(i)) {
                    layer = this.parent.layers.list[i].canvas;
                    layer.style.width = this.parent.scene.width + 'px';
                    layer.style.height = this.parent.scene.height + 'px';
                }
            }
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

        this.width = width;
        this.height = heigth;

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

            this.filter('div.canvas:not(.j2d)').each(function () {
                $(this).data('j2d', new J2D($(this), options)).addClass('j2d');
            });

            if (1 === $(this).length) {
                return $(this).data('j2d');
            }
        };

        $(window).on('resize', function () {
            $('div.canvas.j2d').each(function () {
                $(this).data('j2d').device.resize();
            });
        });
    };

    return J2D;
});
