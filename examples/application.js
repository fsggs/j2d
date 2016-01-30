var global = window;

requirejs.config({
    baseUrl: "../src/js/",
    paths: {
        'jquery': '../../vendor/jquery/dist/jquery.min'
    }
});

define('Application', [
    'jquery',
    'jquery.j2d',
    'io/InputManager'
], function ($, J2D, InputManager) {
    "use strict";

    $(global.document).ready(function () {
        var j2d = window.j2d = $('#j2d').j2d();
        j2d.smoothing = false;
        // j2d.WebGL = true;

        j2d.io = new InputManager(j2d);
        j2d.io.toggleCursor(true); // enable cursor

        var scene = j2d.getSceneManager();

        var GameState = function () {
            var t, x, y;

            this.update = function (timestamp, data) {
                t = new Date().getTime() * 0.0008;
                x = Math.sin(t) * 100 + 150;
                y = Math.cos(t * 0.9) * 100 + 150;
            };
            this.render = function (timestamp, data) {
                scene.clear();
                scene.backgroundColor = 'black';

                scene.context.fillStyle = 'yellow';
                scene.context.fillRect(x, y, 20, 20);
            };
        };

        scene.init({
            width: 400,
            height: 300
        }).setGameState(new GameState).start();
    });

});

require(['Application']);