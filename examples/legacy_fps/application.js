var global;

requirejs.config({
    baseUrl: "../../dist/js/",
    paths: {
        'jquery': '../../dist/vendor/jquery.min',
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
    'j2d.textures',
    'j2d.rect',
    'j2d.line',
    'j2d.text',
    'j2d.circle',
    'j2d.sprite'
], function ($, J2D, IO, FPS) {
    "use strict";

    J2D.initJQueryPlugin();

    $(document).ready(function () {
        var j2d = $('#j2d').j2d();

        j2d.setSmoothing(false);
        //j2d.enableWebGL();
        var input = j2d.IOHandler(new IO(j2d));
        input.toggleCursor(true); // enable cursor

        input.setKeys({
            ACTION: [IO.key.KEY_MOUSE_LEFT, true],
            ALT_ACTION: [IO.key.KEY_SPACE_BAR, true],
            DISABLE_RIGHT_CLICK: [IO.key.KEY_MOUSE_RIGHT, true]
        });

        //var device = j2d.device;
        var scene = j2d.scene;
        var vec2df = j2d.vector.vec2df;
        var Random = j2d.math.random;
        var dvc = j2d.getDevice();

        scene.init(dvc.width / 2, dvc.height / 2);
        j2d.getLayers().add('qwe', -1).fill('#E5E5E5');

        var nodesCount = 0;
        var nodes = [];
        var fps = new FPS();
        var text = scene.addTextNode(vec2df(10, 10), '', 50, 'black', 'Courier New', 8, 'white');

        var move_controller = function (data) {
            if (input.checkPressedKeyMap('ACTION') || input.checkPressedKeyMap('ALT_ACTION')) {
                for (var n = 0; n < 50; n += 1) {
                    var o = scene.addRectNode(input.getPosition(), vec2df(6, 6), j2d.math.randomColor(100, 255, 1));
                    o.dx = Random(-10, 10);
                    o.dy = Random(-10, 10);
                    nodes.push(o);
                    nodesCount = nodes.length;
                }
            }

            for (var i = 0; i < nodesCount; i += 1) {
                if (nodes[i].isOutScene().x != 0) nodes[i].dx *= (-1);
                if (nodes[i].isOutScene().y != 0) nodes[i].dy *= (-1);
                nodes[i].move(vec2df(nodes[i].dx * data.deltaTime, nodes[i].dy * data.deltaTime));
            }
        };

        var draw_viewport = function (data) {
            fps.start(data);
            scene.clear();

            nodes.forEach(function (value, index) {
                nodes[index].draw();
            });

            fps.end(data);
            text.drawSimpleText('Прямоугольники: ' + nodesCount + '\nFPS: ' + fps.getFPS());
        };

        var fpsTest = function (timestamp, data) {
            // Run controllers async! But all draw process in one so-process!
            scene.async(draw_viewport, data);
            scene.async(move_controller, data);
        };
        scene.start(fpsTest, 60);
    });

});

require(['Application']);
