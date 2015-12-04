/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.4
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

define('j2d.textures', [
    'jquery.j2d'
], function (J2D) {
    "use strict";

    var TextureManager = {
        loadImageMap: false,   // загрузка из файла
        createImageMap: false,    // создание анимации напрямую, минуя imageMap
        templates: {}
    };

    TextureManager.createImageMap = function (width, height, callback) {
        var imageObject = {
            img: undefined,
            width: width,
            height: height
        };

        imageObject.img = document.createElement('canvas');
        imageObject.context = imageObject.img.getContext('2d');
        imageObject.img.width = imageObject.width;
        imageObject.img.height = imageObject.height;

        J2D.util.disableSmoothing(imageObject.context);

        callback(imageObject.context);

        /* Функции */
        imageObject.getAnimation = function (sourceX, sourceY, sourceW, sourceH, frameCount) {
            return {
                imageMap: this,
                sourceX: sourceX,
                sourceY: sourceY,
                sourceW: sourceW,
                sourceH: sourceH,
                frameCount: frameCount - 1
            };
        };

        return imageObject;
    };

    TextureManager.loadImageMap = function (path, callback) {
        var imageObject = {
            img: undefined,
            width: 0,
            height: 0,
            loaded: false
        };

        imageObject.img = document.createElement('img');
        imageObject.crossOrigin = 'anonymous';
        imageObject.img.src = path;
        imageObject.img.onload = function () {
            imageObject.width = imageObject.img.width;
            imageObject.height = imageObject.img.height;
            imageObject.loaded = true;

            if(callback) callback();
        };
        /* Свойства */

        /* Функции */
        imageObject.getAnimation = function (sourceX, sourceY, sourceW, sourceH, frameCount) {
            return {
                imageMap: this,
                sourceX: sourceX,
                sourceY: sourceY,
                sourceW: sourceW,
                sourceH: sourceH,
                frameCount: frameCount - 1
            };
        };

        return imageObject;
    };

    /*----------- шаблоны текстур -------------*/

    TextureManager.templates.ellipsis = function (context, size, color) {

    };

    TextureManager.templates.fillRect = function (context, size, color) {
        context.fillStyle = color;
        context.fillRect(0, 0, size.x, size.y);
    };

    TextureManager.templates.strokeRect = function (context, size, color, lineWidth) {
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.strokeRect(0, 0, size.x, size.y);
    };

    TextureManager.templates.gradientL = function (context, size, colors, izHorizontal) {
        var gradient = context.createLinearGradient(0, 0, size.x, 0);
        var step = 1 / colors.length;
        if (!izHorizontal) {
            gradient = context.createLinearGradient(0, 0, 0, size.y);
        }
        for (var i = step / 2, j = 0; j < colors.length; j += 1, i += step) {
            gradient.addColorStop(i, colors[j]);
        }
        context.fillStyle = gradient;
        context.fillRect(0, 0, size.x, size.y);
    };

    TextureManager.templates.gradientR = function (context, size, pos1, r1, pos2, r2, colors) {
        var gradient = context.createRadialGradient(pos1.x, pos1.y, r1, pos2.x, pos2.y, r2);
        var step = 1 / colors.length;
        for (var i = step / 2, j = 0; j < colors.length; j += 1, i += step) {
            gradient.addColorStop(i, colors[j]);
        }
        context.fillStyle = gradient;
        context.fillRect(0, 0, size.x, size.y);
    };

    J2D.prototype.getTextureManager = function () {
        return TextureManager;
    };

    return TextureManager;
});
