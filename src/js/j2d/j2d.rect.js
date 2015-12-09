/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('j2d.rect', ['jquery.j2d', 'j2d.base', 'j2d.scene'], factory);
    } else {
        factory(root.J2D, BaseNode, Scene);
    }
}(global, function (J2D, BaseNode, Scene) {
    "use strict";

    if (!Scene.prototype.addRectNode) {
        Scene.prototype.addRectNode = function (position, size, color) {
            return new RectNode(this.parent, position, size, color);
        };
    }

    var RectNode = function (j2d, position, size, color) {
        BaseNode.call(this, j2d, position, size);
        this.nodeName = 'RectNode';
        this.mergeOptions({
            color: color
        });
    };

    RectNode.prototype = Object.create(BaseNode.prototype);
    RectNode.prototype.constructor = RectNode;

    RectNode.prototype.draw = function () {
        var context = this.layer.context;
        if (this.options.visible && this.isLookScene()) {

            if (this.options.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.options.alpha;
            }

            if (this.options.angle) {
                context.save();
                context.translate(this.getPosition().x - this.j2d.scene.viewport.x, this.getPosition().y - this.j2d.scene.viewport.y);
                context.rotate(this.j2d.math.rad(this.options.angle));
                context.translate(-(this.getPosition().x - this.j2d.scene.viewport.x), -(this.getPosition().y - this.j2d.scene.viewport.y));
            }

            context.fillStyle = this.options.color;
            context.lineWidth = 0;

            context.fillRect(
                this.options.position.x - this.j2d.scene.viewport.x,
                this.options.position.y - this.j2d.scene.viewport.y,
                this.options.size.x, this.options.size.y);

            if (this.options.angle) {
                context.restore();
            }

            if (this.options.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    if (global.J2D !== undefined) global.RectNode = RectNode;
    return RectNode;
});
