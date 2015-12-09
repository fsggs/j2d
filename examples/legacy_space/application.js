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

        'vanilla.override': 'vanilla.override.min'
    }
});

define('Application', [
    'jquery',
    'jquery.j2d',

    'j2d.input',
    'j2d.textures',
    'j2d.rect',
    'j2d.line',
    'j2d.text',
    'j2d.circle',
    'j2d.sprite'
], function ($, J2D, IO) {
    "use strict";

    J2D.initJQueryPlugin();

    $(document).ready(function () {
        var j2d = $('#j2d').j2d();

        j2d.setSmoothing(false);
        //j2d.enableWebGL();
        var input = j2d.IOHandler(new IO(j2d));
        input.toggleCursor(true); // enable cursor

        var dvc = j2d.getDevice();
        var scene = j2d.getScene();
        var layers = j2d.getLayers();
        var vec2df = j2d.vector.vec2df;
        var vec2di = j2d.vector.vec2di;
        var Random = j2d.math.random;
        var rndColor = j2d.math.randomColor;
        var texture = j2d.getTextureManager();

        scene.init(dvc.width, dvc.height);

        layers.add('space', -1);
        layers.getLayer('space').fill('#212121');

        layers.getLayer('space').onContext(function (context) {
            texture.templates.gradientR(context,
                vec2df(scene.width, scene.height),
                vec2df(scene.width / 2, scene.height / 2), 0,
                vec2df(scene.width / 2, scene.height / 2), scene.height / 3,
                ['white', rndColor(220, 255, 1), 'rgba(0,0,0,0)']
            );
        });

        layers.add('back', 1);
        layers.getLayer('back').onContext(function (context) {
            texture.templates.gradientL(context,
                vec2df(scene.width, scene.height),
                ['black', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'black']);

            texture.templates.gradientR(context,
                vec2df(scene.width, scene.height),
                vec2df(scene.width / 2, scene.height / 2), 0,
                vec2df(scene.width / 2, scene.height / 2), scene.width,
                [
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,0)',
                    'rgba(255,255,255,0.3)',
                    'rgba(0,0,0,0)',
                    'rgba(255,255,255,0)',
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,0)'
                ]);

        });

        layers.add('logo', 3);
        //layers.layer('logo').setAlpha(0.4);

        var max = 1000;

        var ob = [];
        var ob2 = [];

        var dy;
        var color;
        var r, o;

        for (var i = 0; i < max; i += 1) {
            dy = Random(80, scene.height);
            color = rndColor(200, 255, 1);

            if (dy > scene.height - 80) {
                dy = Random(scene.height / 3, scene.height / 1.5);
            }

            r = Random(1, 3);
            o = scene.addRectNode(vec2df(Random(0, scene.width - 10), dy), vec2df(r * 0.5, r * 0.5), color);
            o.dx = Random(1, 40) * 0.05 * r / Random(10, 50);
            o.rnd = (Random(0, 50) == 1);
            ob.push(o);
        }

        for (var i = 0; i < max; i += 1) {
            dy = Random(80, scene.height);
            color = rndColor(200, 255, 1);

            if (dy > scene.height - 80) {
                dy = Random(scene.height / 3, scene.height / 1.5);
            }

            r = Random(1, 3);
            o = scene.addRectNode(vec2df(Random(0, scene.width - 10), dy), vec2df(r * 0.5, r * 0.5), color);
            o.dx = -Random(1, 40) * 0.05 * r / Random(10, 50);
            ob2.push(o);
        }

        var move_controller = function (data) {
            for (var i = 0; i < max; i += 1) {
                if (ob2[i].isOutScene().x < 0) ob2[i].options.position.x = scene.width;
                if (ob[i].isOutScene().x) ob[i].options.position.x = 0;

                ob2[i].move(vec2df(ob2[i].dx * data.deltaTime, 0));
                ob[i].move(vec2df(ob[i].dx * data.deltaTime, 0));
            }

            for (var i = 0; i < max; i += 1) {
                if (ob[i].rnd) ob[i].color = rndColor(150, 255, 1);
            }
        };

        var draw_viewport = function () {
            scene.clear();

            for (var i = 0; i < max; i += 1) {
                ob2[i].draw();
                ob[i].draw();
            }
        };

        var Game = function (timestamp, data) {
            // Run controllers async! But all draw process in one so-process!
            scene.async(draw_viewport);
            scene.async(move_controller, data);
        };
        scene.start(Game, 60);

        j2d.element.on('pause', function () {
            var text = scene.addTextNode(vec2df(5, scene.height - 40), 'Чтобы воспроизвести, кликни', 20, 'white', 'serif');
            text.setLayer('logo');
            text.draw();
        });

        j2d.element.on('resume', function () {
            layers.getLayer('logo').clear();
        });
    });

});

require(['Application']);
