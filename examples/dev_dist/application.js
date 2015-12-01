/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors DeVinterX, Skaner(j2ds)
 * @license BSD, zlib(j2ds)
 * @version 0.1.5a, j2ds(0.1.2.501b89)
 */

/*
 * TODO:: Storage
 * TODO:: FPS as part of Debug module!
 */

var global;

requirejs.config({
    baseUrl: "../../src/js/",
    paths: {
        'jquery': '../../vendor/jquery/dist/jquery',
        'jquery.j2d': 'jquery.j2d',

        'j2d.base': 'j2d/j2d.base',
        'j2d.circle': 'j2d/j2d.circle',
        'j2d.fps': 'j2d/j2d.fps',
        'j2d.input': 'j2d/j2d.input',
        'j2d.io.legacy': 'j2d/j2d.io.legacy',
        'j2d.line': 'j2d/j2d.line',
        'j2d.rect': 'j2d/j2d.rect',
        'j2d.sprite': 'j2d/j2d.sprite',
        'j2d.text': 'j2d/j2d.text',
        'j2d.textures': 'j2d/j2d.textures',
        'j2d.webGL2d': 'j2d/j2d.webGL2d',

        'vanilla.override': 'vanilla.override-1.0.3'
    }
});

define('Application', [
    'jquery',
    'jquery.j2d',

    'j2d.input',
    'j2d.fps',
    'j2d.rect',
    'j2d.line',
    'j2d.text'
], function ($, J2D, IO, FPS) {
    "use strict";

    J2D.initJQueryPlugin();

    $(document).ready(function () {
        var j2d = $('#j2d').j2d();
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
        var fps = new FPS(j2d);

        layers.getLayer('1');
        var vec2df = j2d.vector.vec2df;

        scene.init(400, 300);
        //scene.init(device.width, device.height);

        var background = layers.add('background', -1);

        var size = vec2df(25, 25);
        var a = scene.addRectNode(vec2df(140, 140), size, 'red');
        var b = scene.addRectNode(vec2df(140, 140), size, 'green');
        b.setLayer('background');
        var s = scene.addLineNode(vec2df(60, 60), [[0, 0], [100, 0]], 1.0, 'green', 2);

        var _fps = scene.addTextNode(vec2df(5, 5), '', 12, 'white');

        var move_controller = function () {
            var keyData;
            if (keyData = io.checkPressedKeyMap('ACTION')) {
                a.moveTo(io.getPosition(), 10);
                s.moveTo(io.getPosition(), 10);

                //console.log(io.getMouseMoveDistance());
            }
            if (keyData = io.checkPressedKeyMap('TEST_BUTTON')) {
                //console.log(keyData);
            }
        };

        var draw_animation = function () {
            a.turn(1);
            //a.setRotation(20);
            b.setRotation(20);
            s.setRotation(20);
        };

        var draw_viewport = function () {
            fps.start();
            scene.clear();
            background.fill('black');

            s.draw();
            a.draw();
            b.draw();
            //a.drawBox();
            //b.drawBox();
            _fps.drawSimpleText('Current FPS: ' + fps.getFPS());
            fps.end();
        };

        var Game = function () {
            // Run controllers async! But all draw process in one so-process!
            scene.async(draw_animation);
            scene.async(draw_viewport);
            scene.async(move_controller);
        };
        scene.start(Game, 60);
    });
});

require(['Application']);
