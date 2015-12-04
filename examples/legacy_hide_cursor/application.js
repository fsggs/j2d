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
    'j2d.textures',
    'j2d.sprite'
], function ($, J2D, IO) {
    "use strict";

    J2D.initJQueryPlugin();

    $(document).ready(function () {
        var j2d = $('#j2d').j2d();

        j2d.setSmoothing(false);
        //j2d.enableWebGL();
        var input = j2d.IOHandler(new IO(j2d));
        //input.toggleCursor(true); // enable cursor

        var scene = j2d.scene;
        var vec2df = j2d.vector.vec2df;

        // Создаем сцену
        scene.init(640, 300);

        j2d.layers.add('back', -1);
        j2d.layers.getLayer('back').fill('#ceeeee');

        var cell = scene.addSpriteNode(vec2df(0, 0), vec2df(30, 30),
            j2d.getTextureManager().loadImageMap('cell.png').getAnimation(0, 0, 30, 30, 1)
        );

        var draw_viewport = function () {
            scene.clear();
            cell.setPosition(input.getPosition());
            cell.turn(5);
            cell.draw();
        };

        var Game = function () {
            // Run controllers async! But all draw process in one so-process!
            scene.async(draw_viewport);
        };
        scene.start(Game, 60);
    });
});

require(['Application']);
