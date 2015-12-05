/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

define('j2d.base', [
    'jquery.j2d', 'j2d.scene'
], function (J2D, Scene) {
    "use strict";

    if (!Scene.prototype.addBaseNode) {
        Scene.prototype.addBaseNode = function (position, size) {
            return new BaseNode(this.parent, position, size);
        };
    }

    var BaseNode = function (j2d, position, size) {
        this.nodeName = 'BaseNode';
        this.j2d = j2d;
        this.layer = j2d.scene;

        this.options = {
            visible: true,
            alpha: 1,
            position: position,
            size: size,
            parent: false,
            angle: 0,
            box: {
                offset: {
                    x: 0,
                    y: 0
                },
                size: {
                    x: 0,
                    y: 0
                }
            }
        };
    };

    BaseNode.prototype.mergeOptions = function (data, options) {
        if (options === undefined) options = this.options;
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                try {
                    if (data[i].constructor == Object) {
                        options[i] = this.mergeOptions(data[i], options[i]);
                    } else options[i] = data[i];
                } catch (e) {
                    options[i] = data[i];
                }
            }
        }
        return options;
    };

    BaseNode.prototype.saveJSON = function () {
        return JSON.stringify({
            node: this.nodeName,
            data: this.options
        });
    };

    BaseNode.prototype.loadJSON = function (json) {
        json = JSON.parse(json);
        if (this.nodeName === json.node) {
            return this.mergeOptions(json.data);
        }
        throw 'Node type invalid to loadJSON data.';
    };

    BaseNode.prototype.resizeBox = function (offset, size) {
        this.options.box.offset = offset;
        this.options.box.size = size;
    };

    BaseNode.prototype.setLayer = function (layer) {
        this.layer = layer ? this.j2d.layers.getLayer(layer) : this.j2d.scene;
    };

    BaseNode.prototype.getLayer = function () {
        return this.layer;
    };

    BaseNode.prototype.setVisible = function (visible) {
        this.options.visible = visible;
    };

    BaseNode.prototype.isVisible = function () {
        return this.options.visible;
    };

    BaseNode.prototype.setAlpha = function (alpha) {
        if (alpha < 0) alpha = 0;
        if (alpha > 1) alpha = 1;
        this.options.alpha = alpha;
    };

    BaseNode.prototype.getAlpha = function (alpha) {
        return this.options.alpha;
    };

    BaseNode.prototype.moveTo = function (to, t) {
        t = t ? t : 1;
        this.move(this.j2d.vector.vec2df(
            ((to.x - this.getPosition().x) / t),
            ((to.y - this.getPosition().y) / t)
        ));
    };

    BaseNode.prototype.setPosition = function (position) {
        this.options.position = this.j2d.vector.vec2df(
            position.x - Math.ceil(this.options.size.x / 2),
            position.y - Math.ceil(this.options.size.y / 2)
        );
    };

    BaseNode.prototype.move = function (position) {
        this.options.position.x += position.x;
        this.options.position.y += position.y;
    };

    BaseNode.prototype.getPosition = function () {
        return this.j2d.vector.vec2df(
            this.options.position.x + Math.ceil(this.options.size.x / 2),
            this.options.position.y + Math.ceil(this.options.size.y / 2)
        );
    };

    BaseNode.prototype.setSize = function (size) {
        this.options.size = size;
    };

    BaseNode.prototype.getSize = function () {
        return this.options.size;
    };

    BaseNode.prototype.setParent = function (id) {
        this.parent = id;
    };

    BaseNode.prototype.getDistance = function (id) {
        return Math.ceil(Math.sqrt(
                Math.pow(id.getPosition().x - this.getPosition().x, 2) +
                Math.pow(id.getPosition().y - this.getPosition().y, 2)
            )
        );
    };

    BaseNode.prototype.getDistanceXY = function (id) {
        return this.j2d.vector.vec2df(
            Math.abs(id.getPosition().x - this.getPosition().x),
            Math.abs(id.getPosition().y - this.getPosition().y)
        );
    };

    BaseNode.prototype.isIntersect = function (id) {
        var pos = {
            x1: this.options.position.x + this.options.box.offset.x,
            x2: id.options.position.x + id.options.box.offset.x,
            y1: this.options.position.y + this.options.box.offset.y,
            y2: id.options.position.y + id.options.box.offset.y
        };

        var size = {
            x1: this.options.size.x + this.options.box.size.x,
            x2: id.options.size.x + id.options.box.size.x,
            y1: this.options.size.y + this.options.box.size.y,
            y2: id.options.size.y + id.options.box.size.y
        };

        return (
            (pos.y1 + size.y1 >= pos.y2) &&
            (pos.x1 + size.x1 >= pos.x2)
            ) && (
            (pos.x1 < pos.x2 + size.x2) &&
            (pos.y1 < pos.y2 + size.y2)
            );
    };

    BaseNode.prototype.isCollision = function (id) {
        var result = false;
        if (
            (this.getDistanceXY(id).x < (this.options.size.x / 2 + id.options.size.x / 2)) &&
            (this.getDistanceXY(id).y < (this.options.size.y / 2 + id.options.size.y / 2))
        ) {
            result = true;
        }
        return result;
    };

    BaseNode.prototype.isLookScene = function () {
        var yes = true;
        if (
            (this.options.position.x > this.j2d.scene.viewport.x + this.j2d.scene.width ||
            this.options.position.x + this.options.size.x < this.j2d.scene.viewport.x) ||
            (this.options.position.y > this.j2d.scene.viewport.y + this.j2d.scene.height ||
            this.options.position.y + this.options.size.y < this.j2d.scene.viewport.y)
        ) {
            yes = false;
        }
        return yes;
    };

    BaseNode.prototype.turn = function (angle) {
        this.options.angle = (this.options.angle % 360);
        this.options.angle += angle;
    };

    BaseNode.prototype.setRotation = function (angle) {
        this.options.angle = angle % 360;
    };

    BaseNode.prototype.getRotation = function (angle) {
        return this.options.angle;
    };

    BaseNode.prototype.isOutScene = function () {
        return {
            x: (this.options.position.x + this.options.size.x >= this.j2d.scene.viewport.x + this.j2d.scene.width)
                ? 1 : ((this.options.position.x <= this.j2d.scene.viewport.x) ? -1 : 0),
            y: (this.options.position.y + this.options.size.y >= this.j2d.scene.viewport.y + this.j2d.scene.height)
                ? 1 : ((this.options.position.y <= this.j2d.scene.viewport.y) ? -1 : 0),
            all: (this.x || this.y)
        };
    };

    BaseNode.prototype.moveDir = function (speed) {
        this.options.position.x += speed * (Math.cos(this.j2d.math.rad(this.options.angle)));
        this.options.position.y += speed * (Math.sin(this.j2d.math.rad(this.options.angle)));
    };

    BaseNode.prototype.drawBox = function () {
        var context = this.layer.context;

        if (this.options.angle) {
            context.save();
            context.translate(this.getPosition().x - this.j2d.scene.viewport.x, this.getPosition().y - this.j2d.scene.viewport.y);
            context.rotate(this.j2d.math.rad(this.options.angle));
            context.translate(-(this.getPosition().x - this.j2d.scene.viewport.x), -(this.getPosition().y - this.j2d.scene.viewport.y));
        }

        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.lineCap = 'round';
        context.beginPath();

        context.rect(
            this.options.position.x - this.j2d.scene.viewport.x,
            this.options.position.y - this.j2d.scene.viewport.y,
            this.options.size.x, this.options.size.y);
        context.stroke();

        context.strokeStyle = 'yellow';

        context.beginPath();
        context.rect(
            this.options.box.offset.x + this.options.position.x - this.j2d.scene.viewport.x,
            this.options.box.offset.y + this.options.position.y - this.j2d.scene.viewport.y,
            this.options.box.size.x + this.options.size.x,
            this.options.box.size.y + this.options.size.y
        );
        context.stroke();

        context.lineCap = 'butt';
        if (this.options.angle) {
            context.restore();
        }
    };

    return BaseNode;
});
