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
            ACTION: [IO.key.KEY_MOUSE_LEFT, true],
            ALT_ACTION: [IO.key.KEY_SPACE_BAR, true],
            DISABLE_RIGHT_CLICK: [IO.key.KEY_MOUSE_RIGHT, true]
        });

        var dev = j2d.getDevice();
        var scene = j2d.getScene();
        var vec2df = j2d.vector.vec2df;
        var Random = j2d.math.random;

        scene.init(dev.width / 2, dev.height / 2);
        scene.resizeToFullPage(true);

        var grav = 0,
            speed = 1,
            score = 0,
            maxScore = 0;

        var text = scene.addTextNode(vec2df(0, 0), '', 12, 'black', 'Comic Sans MS');
        var text40 = scene.addTextNode(vec2df(0, 0), '', 20, 'black', 'Comic Sans MS');

        var gs = {r: 221, g: 226, b: 227, max: 250, min: 30};

        var gsDark = function (a) {
            a = a || 1;
            return ('rgba(' + Random(gs.min, gs.r) + ',' + Random(gs.min, gs.g) + ',' + Random(gs.min, gs.b) + ', ' + a + ')');
        };

        var gsLight = function () {
            return ('rgb(' + Random(gs.r, gs.max) + ',' + Random(gs.g, gs.max) + ',' + Random(gs.b, gs.max) + ')');
        };

        scene.fillStyle = '#326598';
        scene.strokeStyle = '#a2a2a2';
        scene.font = '18px sens-serif';
        scene.color = 'rgb(' + gs.r + ',' + gs.g + ',' + gs.b + ')';

        var back = [];
        var arr = [];
        var old;
        var oldB;
        var count = 13;
        var a;

        function CreateGame() {
            grav = 0;
            speed = 5;
            score = 0;

            // Создаем прямоугольник
            a = scene.addRectNode(vec2df(0, -50), vec2df(20, 20), gsDark());
            a.setRotation(30);

            arr[0] = scene.addRectNode(vec2df(0, 0), vec2df(200, 20), gsDark());
            old = arr[0];

            for (var i = 1; i < count; i += 1) {
                arr[i] = scene.addRectNode(
                    vec2df(old.options.position.x + old.options.size.x + Random(2, 10), old.options.position.y - Random(0, 2)),
                    vec2df(Random(30, 60), 20),
                    old.color
                );
                old = arr[i];
            }

            back[0] = scene.addRectNode(vec2df(50, 0),
                vec2df(100, 100),
                gsDark(0.2)
            );
            oldB = back[0];

            for (var i = 1; i < count; i += 1) {
                back[i] = scene.addRectNode(
                    vec2df(oldB.options.position.x + oldB.options.size.x + Random(2, 10), oldB.options.position.y - Random(0, 200)),
                    vec2df(Random(10, 100), Random(10, 100)),
                    gsDark(0.2)
                );
                oldB = arr[i];
            }
        }

        var dY = -60;

        function GameNew() {
            scene.clear();
            dY += dY < 0 ? 1 : 0;

            if (io.checkPressedKeyMap('ACTION') || io.checkPressedKeyMap('ALT_ACTION')) {
                CreateGame();
                scene.setGameState(Engine);
            }

            text40.drawSimpleText('BezaBead', vec2df(240, 80 + dY), '#326598');
            text40.drawSimpleText('Коснись экрана, чтобы начать', vec2df(150, 100 + dY));
        }

        var d2Y = -60;

        function GameOver() {
            scene.clear();

            d2Y += d2Y < 0 ? 1 : 0;

            if (io.checkPressedKeyMap('ACTION') || io.checkPressedKeyMap('ALT_ACTION')) {
                CreateGame();
                scene.setGameState(Engine);
            }

            text40.drawSimpleText('Game Over', vec2df(240, 80 + d2Y), '#326598');
            text40.drawSimpleText('Коснись, чтобы сыграть снова', vec2df(150, 110 + d2Y));
            text40.drawSimpleText('YouTube.com/SkanerSoft', vec2df(165, 130 + d2Y));
            text40.drawSimpleText('Самый крутой счет: ' + maxScore, vec2df(180, 160 + d2Y));
        }

        /**      Engine       */
        var move_controller = function (data) {
            grav += (grav > -3 ? -0.5 : 0);

            for (var i = 0; i < count; i += 1) {
                if (!back[i].isLookScene(scene) && back[i].options.position.x < a.options.position.x) {
                    back[i].color = gsDark(0.2);
                    back[i].setPosition(vec2df(scene.viewport.x + scene.width + oldB.options.size.x,
                        a.getPosition().y - Random(0, 200)));
                    oldB = back[i];
                    score += 1;
                }

                if (back[i].options.position.x + back[i].options.size.x > a.options.position.x) {
                    if (a.getDistance(back[i]) > 400) {
                        back[i].move(vec2df(speed - (speed * back[i].options.size.x * 0.05), 0));
                    } else {
                        back[i].move(vec2df(speed - (speed * back[i].options.size.x * 0.01), 0));
                    }
                } else {
                    back[i].move(vec2df(speed - (speed * back[i].options.size.x * 0.05), 0));
                }
            }

            for (var i = 0; i < count; i += 1) {
                if (a.isIntersect(arr[i])) {
                    if (a.getPosition().y + a.options.size.y / 2 - 3 < arr[i].getPosition().y - arr[i].options.size.y / 2
                        && a.options.position.x + a.options.size.x > arr[i].options.position.x) {
                        a.setRotation(0);
                        grav = 0;
                        if (io.checkPressedKeyMap('ACTION') || io.checkPressedKeyMap('ALT_ACTION')) grav = 5;
                    } else {
                        a.color = 'red';
                        d2Y = -60;
                        maxScore = maxScore > score ? maxScore : score;
                        scene.setGameState(GameOver);
                    }
                }

                if (arr[i].options.position.x + arr[i].options.size.x < a.options.position.x) {
                    arr[i].move(vec2df(-speed, 0));
                }

                if (!arr[i].isLookScene(scene) && arr[i].options.position.x < a.options.position.x) {
                    arr[i].setSize(vec2df(speed + Random(20, 100), 20));
                    arr[i].setPosition(
                        vec2df(
                            old.getPosition().x + old.options.size.x + speed * 2 + Random(0, 20),
                            -speed + old.getPosition().y / 2 - Random(0, 20)
                        )
                    );
                    old = arr[i];
                    score += 1;
                }
            }
            speed += data.deltaTime * ((speed < 30 && grav == 0 ) ? (0.05) : ((speed > 1 && grav > 0) ? (-0.05) : 0));
            a.move(vec2df(speed, -grav));
            if (grav != 0) a.turn(2 + Math.abs(grav));

            // Альтернативный вариант позиционирования камеры
            scene.setViewFocus(a, vec2df(100, -50));
        };

        var draw_viewport = function () {
            scene.clear();
            scene.setViewFocus(a, vec2df(100, -50));

            // Рисуем наши объекты
            for (var i = 0; i < count; i += 1) {
                back[i].draw(scene);
                arr[i].draw(scene);
            }
            a.draw();

            // Выводим текст
            text.drawSimpleText('Счет: ' + score + ' | Рекорд: ' + maxScore, vec2df(10, 5));
        };

        var Engine = function (timestamp, data) {
            // Run controllers async! But all draw process in one so-process!
            scene.async(draw_viewport);
            scene.async(move_controller, data);
        };

        scene.start(GameNew, 20);
    });

});

require(['Application']);
