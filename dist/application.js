/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors DeVinterX, Skaner(j2ds)
 * @license BSD, zlib(j2ds)
 * @version 0.1.5a, j2ds(0.1.2.501b89)
 */

/*
 * TODO:: Bugs from j2ds
 * TODO:: Storage
 * TODO:: FPS as part of Debug module!
 * TODO:: *blur & focus element, +!keyboard
 * TODO:: normal fullscreen without bugs(fills, objects on others layers)
 * TODO:: WebGL
 */

var global;

requirejs.config({
    baseUrl: "js/",
    paths: {
        'jquery': '../vendor/jquery.min',
        'jquery.j2d': 'jquery.j2d.min',

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

        'vanilla.override': 'vanilla.override-1.0.3.min',
        'webgl2d.api': 'webgl2d.api.min',
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
        background.fill('black');

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

        var draw_viewport = function () {
            fps.start();
            scene.clear();

            s.draw();
            b.setRotation(20);

            a.draw();
            b.draw();
            //a.drawBox();
            //b.drawBox();
            _fps.drawSimpleText('Current FPS: ' + fps.getFPS());
            fps.end();
        };

        var Game = function () {
            // Run controllers async! But all draw process in one corutine!
            scene.async(draw_animation);
            scene.async(draw_viewport);
            scene.async(move_controller);
        };
        scene.start(Game, 60);
    });
});

require(['Application']);
