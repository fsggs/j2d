/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors DeVinterX, Skaner(j2ds)
 * @license BSD, zlib(j2ds)
 * @version 0.1.5a, j2ds(0.1.2.501b89)
 */

var global;

requirejs.config({
    baseUrl: "js/",
    paths: {
        'jquery': '../vendor/jquery.min',
        'jquery.j2d': 'jquery.j2d.min',

        'j2d.frame': 'j2d/j2d.frame.min',
        'j2d.scene': 'j2d/j2d.scene.min',
        'j2d.layers': 'j2d/j2d.layers.min',
        'j2d.base': 'j2d/j2d.base.min',
        'j2d.circle': 'j2d/j2d.circle.min',
        'j2d.fps': 'j2d/j2d.fps.min',
        'j2d.input': 'j2d/j2d.input.min',
        'j2d.io.legacy': 'j2d/j2d.io.legacy.min',
        'j2d.line': 'j2d/j2d.line.min',
        'j2d.rect': 'j2d/j2d.rect.min',
        'j2d.sprite': 'j2d/j2d.sprite.min',
        'j2d.text': 'j2d/j2d.text.min',
        'j2d.textures': 'j2d/j2d.textures.min',
        'j2d.storage': 'j2d/j2d.storage.min',
        'j2d.webGL2d': 'j2d/j2d.webGL2d.min',

        'vanilla.override': 'vanilla.override-1.0.3.min'
    }
});

define('Application', [
    'jquery',
    'jquery.j2d',

    'j2d.input',
    'j2d.fps',
    'j2d.storage',
    'j2d.textures',
    'j2d.rect',
    'j2d.line',
    'j2d.text',
    'j2d.circle',
    'j2d.sprite'
], function ($, J2D, IO, FPS, Storage) {
    "use strict";

    J2D.initJQueryPlugin();

    $(document).ready(function () {
        var j2d_containers = window.j2ds = $('.multi-2d').j2d();

        var j2d = j2d_containers[0];
        j2d.enableWebGL();
        var io = j2d.IOHandler(new IO(j2d));
        io.toggleCursor(true); // enable cursor

        io.setKeys({
            ACTION: [IO.key.KEY_MOUSE_LEFT, true],
            ALT_ACTION: [IO.key.KEY_MOUSE_RIGHT, true], // disable context menu
            TEST_BUTTON: [IO.key.KEY_W, true]
        });

        //var device = j2d.device;
        var scene = j2d.scene;
        var layers = j2d.layers;
        var fps = new FPS();

        layers.getLayer('1');
        var vec2df = j2d.vector.vec2df;

        scene.init(400, 300);
        //scene.init(device.width, device.height);

        var background = layers.add('background', -1);

        var size = vec2df(25, 25);
        var a = scene.addRectNode(vec2df(40, 40), size, 'red');
        var b = scene.addRectNode(vec2df(140, 140), size, 'green');
        b.setLayer('background');
        var s = scene.addLineNode(vec2df(60, 60), [[0, 0], [100, 100]], 1, 'red', 2);

        var _fps = scene.addTextNode(vec2df(5, 5), '', 12, 'white');

        var move_controller = function () {
            var keyData;
            if (keyData = io.checkPressedKeyMap('ACTION')) {
                a.setPosition(io.getPosition());
                s.setPosition(io.getPosition());

                //console.log(io.getMouseMoveDistance());
            }
            if (keyData = io.checkPressedKeyMap('TEST_BUTTON')) {
                //console.log(keyData);
            }
        };

        var draw_animation = function () {
            a.turn(1);
        };

        var draw_viewport = function (data) {
            fps.start(data);
            scene.clear();
            background.fill('black');

            s.draw();
            b.setRotation(20);

            a.draw();
            b.draw();
            //a.drawBox();
            //b.drawBox();
            _fps.drawSimpleText('Current FPS: ' + fps.getFPS());
            fps.end(data);
        };

        var Game = function (timestamp, data) {
            // Run controllers async! But all draw process in one so-process!
            scene.async(draw_animation);
            scene.async(draw_viewport, data);
            scene.async(move_controller);
        };
        scene.start(Game, 60);

        /*
         * Test Storage
         */
        var _storage = new Storage('j2d');
        _storage.save('text', 'Hello World');
        _storage.saveNode('testNode', a);

        /** TEST Multiple **/
        var j2d_2 = j2d_containers[1];
        j2d_2.setSmoothing(false);
        //j2d_2.enableWebGL();
        var io2 = j2d_2.IOHandler(new IO(j2d_2));
        io2.toggleCursor(true);

        io2.setKeys({
            ACTION: [IO.key.KEY_MOUSE_LEFT, true],
            ALT_ACTION: [IO.key.KEY_MOUSE_RIGHT, true], // disable context menu

            MOVE_UP: [IO.key.KEY_W, true],
            MOVE_DOWN: [IO.key.KEY_S, true],
            MOVE_LEFT: [IO.key.KEY_A, true],
            MOVE_RIGHT: [IO.key.KEY_D, true]
        });

        var scene2 = j2d_2.scene;
        scene2.init(400, 300);
        var t = scene2.addRectNode(vec2df(140, 140), size, 'blue');
        var _fps2 = scene2.addTextNode(vec2df(5, 5), '', 12, 'white');

        var width = 100,
            height = 100;

        var texture = j2d_2.getTextureManager();

        var ship = scene2.addRectNode(vec2df(10, 10), vec2df(width, height), 'rgba(0, 0, 0, 0)');
        var imageMap = texture.loadImageMap('img/ship.png', function () {
            ship = scene2.addSpriteNode(vec2df(10, 10), vec2df(width, height), imageMap.getAnimation(0, 0, width, height, 1));
        });
        scene2.setViewFocus(ship, vec2df(0, 0));

        var move_controller2 = function () {
            if (io2.checkPressedKeyMap('ACTION')) {
                ship.moveTo(io2.getPosition(), 10);
            }

            var diagonal = false;

            if (io2.checkPressedKeyMap('MOVE_UP') && io2.checkPressedKeyMap('MOVE_LEFT')) {
                diagonal = true;
                ship.setRotation(-45);
                ship.move(vec2df(-2.5, -2.5));
            }
            if (io2.checkPressedKeyMap('MOVE_DOWN') && io2.checkPressedKeyMap('MOVE_LEFT')) {
                diagonal = true;
                ship.setRotation(-135);
                ship.move(vec2df(-2.5, 2.5));
            }
            if (io2.checkPressedKeyMap('MOVE_UP') && io2.checkPressedKeyMap('MOVE_RIGHT')) {
                diagonal = true;
                ship.setRotation(45);
                ship.move(vec2df(2.5, -2.5));
            }
            if (io2.checkPressedKeyMap('MOVE_DOWN') && io2.checkPressedKeyMap('MOVE_RIGHT')) {
                diagonal = true;
                ship.setRotation(135);
                ship.move(vec2df(2.5, 2.5));
            }

            if (!diagonal) {
                if (io2.checkPressedKeyMap('MOVE_UP')) {
                    ship.setRotation(0);
                    ship.move(vec2df(0, -5));
                }
                if (io2.checkPressedKeyMap('MOVE_DOWN')) {
                    ship.setRotation(180);
                    ship.move(vec2df(0, 5));
                }
                if (io2.checkPressedKeyMap('MOVE_LEFT')) {
                    ship.setRotation(-90);
                    ship.move(vec2df(-5, 0));
                }
                if (io2.checkPressedKeyMap('MOVE_RIGHT')) {
                    ship.setRotation(90);
                    ship.move(vec2df(5, 0));
                }
            }

            scene2.setViewFocus(ship, vec2df(0, 0));
        };

        var draw_viewport2 = function (data) {
            fps.start(data);
            scene2.clear();
            scene2.getLayer().fill('black');

            t.turn(-2);
            t.draw();

            ship.draw();

            _fps2.drawSimpleText('Current FPS: ' + fps.getFPS());
            fps.end(data);
        };
        var Game2 = function (timestamp, data) {
            scene2.async(draw_viewport2, data);
            scene2.async(move_controller2);
        };
        scene2.start(Game2, 60);
        /** TEST Multiple **/
    });
});

require(['Application']);
