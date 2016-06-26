import $ from 'jquery';
import {
    J2D,
    IO,
    MediaManager,
    Vector2d,
    RectNode,
    Camera,
    Tween,
    BaseGameState
} from 'jquery.j2d';

$(document).ready(() => {
    /** @type J2D */
    var j2d = global.j2d = $('#j2d').j2d();
    j2d.smoothing = false;
    //j2d.WebGL = true;

    j2d.media = new MediaManager(j2d);
    j2d.io = new IO(j2d);

    var scene = j2d.getSceneManager();
    var gsm = j2d.getGameStatesManager();

    var width = 400,
        height = 300;
    var time = 0;

    class GameState extends BaseGameState {
        constructor(gsm, data) {
            super(gsm, data);
        }

        init(data) {
            /* Nodes */
            /** @type {BaseNode|AnimatedNode|RectNode} */
            this.rectangle1 = (new RectNode({color: 'yellow'}))
                .setSize(new Vector2d(20, 20))
                .setPosition(new Vector2d(20, 20));

            this.rectangle2 = (new RectNode({color: 'green'}))
                .setSize(new Vector2d(20, 20))
                .setPosition(new Vector2d(20, 40));

            this.rectangle3 = (new RectNode({color: 'red'}))
                .setSize(new Vector2d(20, 20))
                .setPosition(new Vector2d(60, 40));

            global.r1 = this.rectangle1;

            /** @type {BaseNode|CameraNode} */
            this.camera_1st = (new Camera()).setSize(new Vector2d(400, 300));

            return super.init(this, data);
        }

        load(data) {
            scene.add(this.rectangle1);
            scene.add(this.rectangle2);
            scene.add(this.rectangle3);
            scene.registerCamera(this.camera_1st);

            j2d.io.toggleCursor(true); // enable cursor

            j2d.io.setKeys({
                ACTION: [IO.key.KEY_MOUSE_LEFT, true],
                ALT_ACTION: [IO.key.KEY_MOUSE_RIGHT, true], // disable context menu

                MOVE_UP: [IO.key.KEY_W, true],
                MOVE_DOWN: [IO.key.KEY_S, true],
                MOVE_LEFT: [IO.key.KEY_A, true],
                MOVE_RIGHT: [IO.key.KEY_D, true]
            });

            return super.load(this, data);
        }

        update(timestamp, data) {
            time = timestamp;
            if (j2d.io.checkPressedKeyMap('ACTION')) {
                new Tween(this.rectangle1)
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
                    .reverseAll()
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
            this.camera_1st.setSize(new Vector2d(width, height));
            scene.updateViewport(this.camera_1st);

            return true;
        }

        render(timestamp, data) {
            scene.clear();
            scene.fillBackground();
            scene.render(data);

            return true;
        }
    }

    // Fix for Camera
    $(window).on('resize', () => {
        width = j2d.element.width();
        height = j2d.element.height();
    });

    scene.init({
        width: width,
        height: height,
        backgroundColor: 'black'
    }).start();

    gsm.add(new GameState(), 'myGame');
});
