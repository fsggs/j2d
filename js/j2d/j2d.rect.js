/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.0
 * @see https://github.com/SkanerSoft/J2ds/commit/81c85984b36cfd7ff413577737e10e8a81b0263c
 */

define([
    'jquery.j2d',
    'j2d/j2d.base'
], function (J2D, BaseNode) {
    "use strict";

    if (!J2D.prototype.scene.addRectNode) {
        J2D.prototype.scene.addRectNode = function (pos, size, color) {
            return new RectNode(this.parent, pos, size, color);
        };
    }

    var RectNode = function (j2d, pos, size, color) {

        BaseNode.call(this, j2d, pos, size);

        this.color = color;
    };

    RectNode.prototype = Object.create(BaseNode.prototype);
    RectNode.prototype.constructor = RectNode;

    RectNode.prototype.draw = function () {
        var context = this.layer.context;
        if (this.visible && this.isLookScene()) {

            if (this.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.alpha;
            }

            if (this.angle) {
                context.save();
                context.translate(this.getPosition().x - this.j2d.scene.viewport.x, this.getPosition().y - this.j2d.scene.viewport.y);
                context.rotate(this.j2d.math.rad(this.angle));
                context.translate(-(this.getPosition().x - this.j2d.scene.viewport.x), -(this.getPosition().y - this.j2d.scene.viewport.y));
            }

            context.fillStyle = this.color;

            context.fillRect(
                this.pos.x - this.j2d.scene.viewport.x,
                this.pos.y - this.j2d.scene.viewport.y,
                this.size.x, this.size.y);

            if (this.angle) {
                context.restore();
            }

            if (this.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    return RectNode;
});
