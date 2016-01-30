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

    J2D.initPlugin();

    $(global.document).ready(function () {
        var j2d = window.j2d = $('#j2d').j2d();
        j2d.smoothing = false;
        // j2d.WebGL = true;

        j2d.io = new InputManager(j2d);
        j2d.io.toggleCursor(true); // enable cursor

        var scene = j2d.getSceneManager();

        var GameState = function () {
            this.update = function (timestamp, data) {

            };
            // console.log('bu');
        };

        scene.init({
            width: 400,
            height: 300,
            backgroundColor: 'black'
        }).setGameState(new GameState).start();
    });

});

require(['Application']);