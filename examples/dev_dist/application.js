/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors DeVinterX, Skaner(j2ds)
 * @license BSD, zlib(j2ds)
 * @version 0.1.5a, j2ds(0.1.2.501b89)
 */

/*
 *  v.0.1.5
 * TODO:: Storage
 * TODO:: FPS as part of Debug module!
 * TODO:: focus|blur events
 * TODO:: documentation & legacy demos
 *
 *  v.0.1.6
 * TODO:: Merge with <- j2ds 0.2.0+
 *
 *  v.0.1.7
 * TODO:: WebGL PolyLine replacement LinePath
 * TODO:: WebGL position fix
 * TODO:: Nodes for bezierCurve & quadraticCurve
 * TODO:: fix all knows bugs in WebGL adaptation
 * TODO::
 *
 *  v.0.1.6
 * TODO:: Collection & Layers global collection
 * TODO:: specific plugin demos (not legacy)
 */

var global;

requirejs.config({
    baseUrl: "../../src/js/",
    paths: {
        'jquery': '../../vendor/jquery/dist/jquery',
        'jquery.j2d': 'jquery.j2d',

        'j2d.frame': 'j2d/j2d.frame',
        'j2d.scene': 'j2d/j2d.scene',
        'j2d.layers': 'j2d/j2d.layers',
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

        var draw_viewport = function (data) {
            fps.start(data);
            scene.clear();
            background.fill('black');

            s.draw();
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

        /** TEST Multiple **/
        var j2d_2 = j2d_containers[1];
        //j2d_2.enableWebGL();
        var io2 = j2d_2.IOHandler(new IO(j2d_2));
        io2.toggleCursor(true);

        io2.setKeys({
            ACTION: [IO.key.KEY_MOUSE_LEFT, true],
            ALT_ACTION: [IO.key.KEY_MOUSE_RIGHT, true] // disable context menu
        });

        var scene2 = j2d_2.scene;
        scene2.init(400, 300);
        var t = scene2.addRectNode(vec2df(140, 140), size, 'blue');
        var _fps2 = scene2.addTextNode(vec2df(5, 5), '', 12, 'white');

        var move_controller2 = function () {
            if (io2.checkPressedKeyMap('ACTION')) {
                t.moveTo(io2.getPosition(), 10);
                t.moveTo(io2.getPosition(), 10);
            }
        };

        var draw_viewport2 = function (data) {
            fps.start(data);
            scene2.clear();
            scene2.getLayer().fill('black');
            t.turn(-2);
            t.draw();
            _fps2.drawSimpleText('Current FPS: ' + fps.getFPS());
            fps.end(data);
        };
        var Game2 = function (timestamp, data) {
            scene2.async(draw_viewport2, data);
            scene2.async(move_controller2);
        };
        scene2.start(Game2, 15);
        /** TEST Multiple **/
    });

});

require(['Application']);
