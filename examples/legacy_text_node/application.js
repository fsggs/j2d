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
        var io = j2d.IOHandler(new IO(j2d));
        io.toggleCursor(true); // enable cursor

        var dev = j2d.getDevice();
        var scene = j2d.scene;
        var vec2df = j2d.vector.vec2df;

        scene.init(dev.width, dev.height);

        var pos1 = vec2df(50, 50), // Позиция
            size1 = 25, // размер текста
            color1 = 'black', // Цвет текста
            family1 = 'serif', // Шрифт
            lineWidth1 = 0, // Ширина обводки текста
            lineColor1 = 'white'; // Цвет обводки
        var t = scene.addTextNode(pos1, 'Обычный текст\nНовая строка поддерживается', size1, color1, family1, lineWidth1, lineColor1);

        var pos2 = vec2df(50, 100), // Позиция
            size2 = 20, // размер текста
            color2 = 'black', // Цвет текста
            family2 = 'serif', // Шрифт
            lineWidth2 = 1, // Ширина обводки текста
            lineColor2 = 'white'; // Цвет обводки
        var t2 = scene.addTextNode(pos2, 'Обведенный текст', size2, color2, family2, lineWidth2, lineColor2);

        var pos3 = vec2df(300, 50), // Позиция
            size3 = 20, // размер текста
            color3 = 'black', // Цвет текста
            family3 = 'serif', // Шрифт
            lineWidth3 = 1, // Ширина обводки текста
            lineColor3 = 'white'; // Цвет обводки
        var t3 = scene.addTextNode(pos3, 'Вращающийся текст\nПоддерживает новую строку', size3, color3, family3, lineWidth3, lineColor3);

        var pos4 = vec2df(300, 220), // Позиция
            size4 = 30, // размер текста
            color4 = '#A52A2A', // Цвет текста
            family4 = 'serif', // Шрифт
            lineWidth4 = 2, // Ширина обводки текста
            lineColor4 = '#FFFF00'; // Цвет обводки
        var t4 = scene.addTextNode(pos4, 'Цветной текст', size4, color4, family4, lineWidth4, lineColor4);

        var pos5 = vec2df(300, 300), // Позиция
            size5 = 30, // размер текста
            color5 = '#A52A2A', // Цвет текста
            family5 = 'Comic Sans MS', // Шрифт
            lineWidth5 = 0, // Ширина обводки текста
            lineColor5 = '#FFFF00'; // Цвет обводки
        var t5 = scene.addTextNode(pos5, 'Другой шрифт (Comic Sans MS)', size5, color5, family5, lineWidth5, lineColor5);

        var text = scene.addTextNode(vec2df(0, 0), '', 25, '#B88526', 'Comic Sans MS', 5, '#FEDC9D');

        var move_controller = function () {
            t.move(vec2df(0.1, 0));
            t2.move(vec2df(0.2, 0));
            t4.move(vec2df(0.5, 0));
            t5.move(vec2df(-0.1, 0));
            t3.turn(1);
            t3.move(vec2df(0, 0.2));
        };

        var draw_viewport = function (data) {
            scene.clear();

            t.draw();
            t2.draw();
            t3.draw();
            t4.draw();
            t5.draw();

            text.drawSimpleText('Динамический текст: ' + io.getPosition().x + ' x ' + io.getPosition().y, io.getPosition());
        };

        var Game = function (timestamp, data) {
            // Run controllers async! But all draw process in one so-process!
            scene.async(draw_viewport, data);
            scene.async(move_controller);
        };
        scene.start(Game, 60);
    });

});

require(['Application']);
