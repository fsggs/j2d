/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.4
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

define('j2d.base', [
    'jquery.j2d'
], function (J2D) {
    "use strict";

    if (!J2D.prototype.scene.addBaseNode) {
        J2D.prototype.scene.addBaseNode = function (pos, size) {
            return new BaseNode(this.parent, pos, size);
        };
    }

    var BaseNode = function (j2d, pos, size) {
        this.j2d = j2d;
        this.visible = true;
        this.alpha = 1;
        this.pos = pos;
        this.size = size;
        this.parent = false;
        this.angle = 0;
        this.layer = j2d.scene;
        this.box = {
            offset: {x: 0, y: 0},
            size: {x: 0, y: 0}
        };
    };

    BaseNode.prototype.resizeBox = function (offset, size) {
        this.box.offset = offset;
        this.box.size = size;
    };

    BaseNode.prototype.setLayer = function (layer) {
        this.layer = layer ? this.j2d.layers.getLayer(layer) : this.j2d.scene;
    };

    BaseNode.prototype.getLayer = function () {
        return this.layer;
    };

    BaseNode.prototype.setVisible = function (visible) {
        this.visible = visible;
    };

    BaseNode.prototype.isVisible = function () {
        return this.visible;
    };

    BaseNode.prototype.setAlpha = function (alpha) {
        if (alpha < 0) alpha = 0;
        if (alpha > 1) alpha = 1;
        this.alpha = alpha;
    };

    BaseNode.prototype.getAlpha = function (alpha) {
        return this.alpha;
    };

    BaseNode.prototype.moveTo = function (to, t) {
        t = t ? t : 1;
        this.move(this.j2d.vector.vec2df(
            ((to.x - this.getPosition().x) / t),
            ((to.y - this.getPosition().y) / t)
        ));
    };

    BaseNode.prototype.setPosition = function (pos) {
        this.pos = this.j2d.vector.vec2df(pos.x - Math.ceil(this.size.x / 2), pos.y - Math.ceil(this.size.y / 2));
    };

    BaseNode.prototype.move = function (pos) {
        this.pos.x += pos.x;
        this.pos.y += pos.y;
    };

    BaseNode.prototype.getPosition = function () {
        return this.j2d.vector.vec2df(this.pos.x + Math.ceil(this.size.x / 2), this.pos.y + Math.ceil(this.size.y / 2));
    };

    BaseNode.prototype.setSize = function (size) {
        this.size = size;
    };

    BaseNode.prototype.getSize = function () {
        return this.size;
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
        return this.j2d.vector.vec2df(Math.abs(id.getPosition().x - this.getPosition().x), Math.abs(id.getPosition().y - this.getPosition().y));
    };

    BaseNode.prototype.isIntersect = function (id) {
        var pos = {
            x1: this.pos.x + this.box.offset.x,
            x2: id.pos.x + id.box.offset.x,
            y1: this.pos.y + this.box.offset.y,
            y2: id.pos.y + id.box.offset.y
        };

        var size = {
            x1: this.size.x + this.box.size.x,
            x2: id.size.x + id.box.size.x,
            y1: this.size.y + this.box.size.y,
            y2: id.size.y + id.box.size.y
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
            (this.getDistanceXY(id).x < (this.size.x / 2 + id.size.x / 2)) &&
            (this.getDistanceXY(id).y < (this.size.y / 2 + id.size.y / 2))
        ) {
            result = true;
        }
        return result;
    };

    BaseNode.prototype.isLookScene = function () {
        var yes = true;
        if (
            (this.pos.x > this.j2d.scene.viewport.x + this.j2d.scene.width ||
            this.pos.x + this.size.x < this.j2d.scene.viewport.x) ||
            (this.pos.y > this.j2d.scene.viewport.y + this.j2d.scene.height ||
            this.pos.y + this.size.y < this.j2d.scene.viewport.y)
        ) {
            yes = false;
        }
        return yes;
    };

    BaseNode.prototype.turn = function (angle) {
        this.angle = (this.angle % 360);
        this.angle += angle;
    };

    BaseNode.prototype.setRotation = function (angle) {
        this.angle = angle % 360;
    };

    BaseNode.prototype.getRotation = function (angle) {
        return this.angle;
    };

    BaseNode.prototype.isOutScene = function () {
        var o = {};

        if (this.pos.x + this.size.x >= this.j2d.scene.viewport.x + this.j2d.scene.width) {
            o.x = 1;
        } else if (this.pos.x <= this.j2d.scene.viewport.x) {
            o.x = -1;
        } else {
            o.x = 0;
        }

        if (this.pos.y + this.size.y >= this.j2d.scene.viewport.y + this.j2d.scene.height) {
            o.y = 1;
        } else if (this.pos.y <= this.j2d.scene.viewport.y) {
            o.y = -1;
        } else {
            o.y = 0;
        }

        o.all = (o.x || o.y);

        return o;
    };

    BaseNode.prototype.moveDir = function (speed) {
        this.pos.x += speed * (Math.cos(this.j2d.math.rad(this.angle)));
        this.pos.y += speed * (Math.sin(this.j2d.math.rad(this.angle)));
    };

    BaseNode.prototype.drawBox = function () {
        var context = this.layer.context;
        context.lineWidth = 2;
        context.strokeStyle = 'black';

        context.beginPath();

        context.rect(
            this.pos.x - this.j2d.scene.viewport.x,
            this.pos.y - this.j2d.scene.viewport.y,
            this.size.x, this.size.y);
        context.stroke();

        context.strokeStyle = 'yellow';

        context.beginPath();
        context.rect(this.box.offset.x + this.pos.x - this.j2d.scene.viewport.x, this.box.offset.y + this.pos.y - this.j2d.scene.viewport.y,
            this.box.size.x + this.size.x, this.box.size.y + this.size.y);
        context.stroke();
    };

    return BaseNode;
});
