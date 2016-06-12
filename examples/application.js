var global = window;

requirejs.config({
    baseUrl: '../src/js/',
    paths: {
        'jquery': '../../vendor/jquery/dist/jquery.min'
    }
});

define('Application', [
        'jquery',
        'jquery.j2d',
        'io/InputManager',
        'io/MediaManager',
        'utils/Vector2d',
        'nodes/RectNode',
        'nodes/CameraNode',
        'transitions/Tween'
    ],
    /**
     * @param {Function|jQuery} $
     * @param {Function|J2D} J2D
     * @param {Function|InputManager} IO
     * @param {Function|MediaManager} MediaManager
     * @param {Function|Vector2d} Vector2d
     * @param {Function|RectNode} RectNode
     * @param {Function|CameraNode} Camera
     * @param {Function|Tween} Tween
     */
    function ($, J2D, IO, MediaManager, Vector2d, RectNode, Camera, Tween) {
        "use strict";

        $(global.document).ready(function () {
            /** @type J2D */
            var j2d = global.j2d = $('#j2d').j2d();
            j2d.smoothing = false;
            //j2d.WebGL = true;

            j2d.io = new IO(j2d);
            j2d.io.toggleCursor(true); // enable cursor

            j2d.io.setKeys({
                ACTION: [IO.key.KEY_MOUSE_LEFT, true],
                ALT_ACTION: [IO.key.KEY_MOUSE_RIGHT, true], // disable context menu

                MOVE_UP: [IO.key.KEY_W, true],
                MOVE_DOWN: [IO.key.KEY_S, true],
                MOVE_LEFT: [IO.key.KEY_A, true],
                MOVE_RIGHT: [IO.key.KEY_D, true]
            });

            j2d.media = new MediaManager(j2d);

            // j2d.media.addSound({
            //     id: 'test',
            //     src: 'test.ogg'
            // });

            // j2d.media.audio("test").play();

            /* Managers */
            var scene = j2d.getSceneManager();

            /* Nodes */
            /** @type {BaseNode|AnimatedNode|RectNode} */
            var rectangle1 = (new RectNode({color: 'yellow'}))
                .setSize(new Vector2d(20, 20))
                .setPosition(new Vector2d(20, 20));

            var rectangle2 = (new RectNode({color: 'green'}))
                .setSize(new Vector2d(20, 20))
                .setPosition(new Vector2d(20, 40));

            var rectangle3 = (new RectNode({color: 'red'}))
                .setSize(new Vector2d(20, 20))
                .setPosition(new Vector2d(60, 40));

            global.r1 = rectangle1;

            /** @type {BaseNode|CameraNode} */
            var camera_1st = (new Camera()).setSize(new Vector2d(400, 300));

            scene.add(rectangle1);
            scene.add(rectangle2);
            scene.add(rectangle3);
            scene.registerCamera(camera_1st);

            var width = 400,
                height = 300;
            var time = 0;

            var GameState = function () {
                var t, x, y;
                var ts = true;

                this.update = function (timestamp, data) {
                    time = timestamp;
                    if (j2d.io.checkPressedKeyMap('ACTION')) {
                        new Tween(rectangle1)
                            .to({
                                position: {
                                    x: '60'
                                }
                            })
                            .to({
                                position: {
                                    y: '40'
                                }
                            })
                            .to({
                                position: {
                                    x: '-60'
                                }
                            })
                            .to({
                                position: {
                                    y: '-40'
                                }
                            })
                            .start(timestamp);
                    }
                    //
                    //     //rectangle1.setPosition(new Vector2d(20, 20));
                    //     //rectangle2.setPosition(new Vector2d(20, 40));
                    //
                    //     //rectangle1.moveTo(new Vector2d(200, 20), 4000);
                    //     //rectangle2.moveTo(new Vector2d(100, 40), 4000);
                    //
                    // }

                    // if (j2d.io.checkPressedKeyMap('MOVE_UP')) rectangle.moveTo(new Vector2d(100, 100));
                    // if (j2d.io.checkPressedKeyMap('MOVE_DOWN')) rectangle.moveTo(new Vector2d(0, 2));
                    // if (j2d.io.checkPressedKeyMap('MOVE_LEFT')) rectangle.moveTo(new Vector2d(-2, 0));
                    // if (j2d.io.checkPressedKeyMap('MOVE_RIGHT')) rectangle.moveTo(new Vector2d(2, 0));

                    //TODO:: fix camera original screen size in /core
                    camera_1st.setSize(new Vector2d(width, height));
                    scene.updateViewport(camera_1st);
                };

                this.update2 = function (timestamp, data) {
                    t = timestamp * 0.0018;
                    x = Math.sin(t) * 100 + 150;
                    y = Math.cos(t * 0.9) * 100 + 150;
                    t = null;

                    camera_1st.angle = camera_1st.angle + (ts ? 1 : -1);
                    camera_1st.setSize(new Vector2d(width + camera_1st.angle, height + camera_1st.angle));
                    camera_1st.scale = camera_1st.angle / 50;

                    if (camera_1st.angle >= 360 - 1) ts = false;
                    if (camera_1st.angle == 0) ts = true;

                    //rectangle.angle = rectangle.angle - 2;
                    rectangle1.setPosition(new Vector2d(x, y)).setColor(!ts ? 'yellow' : 'grey');
                    scene.updateViewport(camera_1st);

                    //scene.updateViewport();
                };

                this.render = function (timestamp, data) {
                    scene.clear();
                    scene.fillBackground();
                    scene.render(data);
                };
            };

            // Fix for Camera
            $(window).on('resize', function () {
                width = j2d.element.width();
                height = j2d.element.height();
            });

            scene.init({
                width: width,
                height: height,
                backgroundColor: 'black'
            }).setGameState(GameState).start();
        });

    });

require(['Application']);
