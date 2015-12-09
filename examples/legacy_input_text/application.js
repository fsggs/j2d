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

        io.setKeys({
            ALT_ACTION: [IO.key.KEY_MOUSE_RIGHT, true], // disable context menu

            MOVE_UP: [IO.key.KEY_W, true],
            MOVE_DOWN: [IO.key.KEY_S, true],
            MOVE_LEFT: [IO.key.KEY_A, true],
            MOVE_RIGHT: [IO.key.KEY_D, true],

            ALT_MOVE_UP: [IO.key.KEY_UP_ARROW, true],
            ALT_MOVE_DOWN: [IO.key.KEY_DOWN_ARROW, true],
            ALT_MOVE_LEFT: [IO.key.KEY_LEFT_ARROW, true],
            ALT_MOVE_RIGHT: [IO.key.KEY_RIGHT_ARROW, true]
        });

        //var device = j2d.device;
        var scene = j2d.scene;
        var lr = j2d.layers;
        var vec2df = j2d.vector.vec2df;
        var vec2di = j2d.vector.vec2di;
        var texture = j2d.getTextureManager();

        scene.init(640, 380);

        var mlr = lr.add('back', -1);

        mlr.onContext(function (ctx) {
            for (var i = 0, iStep = scene.width / 100; i < scene.width; i += iStep) {
                for (var j = 0, jStep = scene.height / 100; j < scene.height; j += jStep) {
                    ctx.fillStyle = j2d.math.randomColor(180, 255, 1);
                    ctx.fillRect(i, j, iStep, jStep);
                }
            }
        });

        var width = 100,
            height = 100;

        var imageMap = texture.createImageMap(width, height, function (context) {
            texture.templates.gradientR(context,
                vec2df(width, height),
                vec2df(width / 2, height / 2), height / 5,
                vec2df(width / 2, height / 2), height / 2,
                [j2d.math.randomColor(150, 255, 0.5), j2d.math.randomColor(150, 255, 1), 'rgba(255,255,255,0)']);
        });

        var a = scene.addSpriteNode(vec2df(10, 10), vec2df(width, height), imageMap.getAnimation(0, 0, width, height, 1));

        var move_controller = function () {
            if (io.checkPressedKeyMap('MOVE_UP') || io.checkPressedKeyMap('ALT_MOVE_UP')) a.move(vec2df(0, -1));
            if (io.checkPressedKeyMap('MOVE_DOWN') || io.checkPressedKeyMap('ALT_MOVE_DOWN')) a.move(vec2df(0, 1));
            if (io.checkPressedKeyMap('MOVE_LEFT') || io.checkPressedKeyMap('ALT_MOVE_LEFT')) a.move(vec2df(-1, 0));
            if (io.checkPressedKeyMap('MOVE_RIGHT') || io.checkPressedKeyMap('ALT_MOVE_RIGHT')) a.move(vec2df(1, 0));
        };

        var draw_viewport = function () {
            scene.clear();
            a.draw();
        };

        var Game = function () {
            // Run controllers async! But all draw process in one so-process!
            scene.async(draw_viewport);
            scene.async(move_controller);
        };
        scene.start(Game, 60);

        $(document).on('click', '#chatMess', function () {
            $('#textBuffer').html('');
            io.setWriteMode(true);
            $('#textCursor').show();
        });

        j2d.element.on('keyboardCharPress', function (e, data) {
            var symbol = data.char;
            var key = data.key;
            var $textBuffer = $('#textBuffer');

            $textBuffer.html($textBuffer.html() + symbol);

            if (key === IO.key.KEY_ENTER && $textBuffer.html() != '') {
                var $chatRoom = $('#chatRoom');
                $chatRoom.html($chatRoom.html() + '<b>You Say:</b> ' + $textBuffer.html() + '<br /><br />');
                $textBuffer.html('Введите текст!');
                io.setWriteMode(false);
                $('#textCursor').hide();
            }
        });

        j2d.element.on('keyboardKeyUp', function (e, data) {
            var key = data.key;
            var $textBuffer = $('#textBuffer');

            if (key === IO.key.KEY_ESCAPE) {
                io.setWriteMode(false);
                $textBuffer.html('Введите текст!');
                $('#textCursor').hide();
            }

            if (key === IO.key.KEY_BACKSPACE) {
                console.log('bu');
                $textBuffer.html($textBuffer.html().substring(0, $textBuffer.html().length - 1));
                $('#textCursor').hide();
            }
        });

        $('#chatRoom')
            .css('left', scene.width + 'px')
            .css('height', scene.height - 112 + 'px')
            .css('backgroundColor', j2d.math.randomColor(220, 255, 1));

        $('#chatMess').css('left', scene.width + 'px').css('backgroundColor', 'white');
    });

});

require(['Application']);
