/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

define('j2d.sprite', [
    'jquery.j2d',
    'j2d.base',
    'j2d.scene'
], function (J2D, BaseNode, Scene) {
    "use strict";

    if (!Scene.prototype.addSpriteNode) {
        Scene.prototype.addSpriteNode = function (position, size, animation) {
            return new SpriteNode(this.parent, position, size, animation);
        };
    }

    var SpriteNode = function (j2d, position, size, animation) {
        BaseNode.call(this, j2d, position, size);
        this.nodeName = 'SpriteNode';
        this.mergeOptions({
            tmpSpeed: 0,
            frame: 0,
            animation: animation,
            flip: {
                x: false,
                y: false
            }
        });
    };

    SpriteNode.prototype = Object.create(BaseNode.prototype);
    SpriteNode.prototype.constructor = SpriteNode;

    SpriteNode.prototype.setFlip = function (x, y) {
        this.options.flip = {
            x: x,
            y: y
        };
    };

    SpriteNode.prototype.draw = function (speed) {
        if (this.options.visible && this.isLookScene()) {
            speed = speed || 1;

            if (this.options.frame > this.options.animation.frameCount) {
                this.options.frame = 0;
            }
            this.drawFrame(this.options.frame + 1);

            if (this.options.tmpSpeed > speed) {
                this.options.frame += 1;
                this.options.tmpSpeed = 0;
            } else {
                this.options.tmpSpeed += 1;
            }
        }
    };

    // отрисовка одного кадра
    SpriteNode.prototype.drawFrame = function (frame) {
        var context = this.layer.context;
        if (this.options.visible && this.isLookScene()) {

            if (this.options.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.options.alpha;
            }

            context.lineWidth = 0;

            if (this.options.angle || this.options.flip.x || this.options.flip.y) {
                context.save();
                context.translate(this.getPosition().x - this.j2d.scene.viewport.x, this.getPosition().y - this.j2d.scene.viewport.y);
                context.rotate(this.j2d.math.rad(this.options.angle));
                context.scale(this.options.flip.x ? -1 : 1, this.options.flip.y ? -1 : 1);
                context.translate(-(this.getPosition().x - this.j2d.scene.viewport.x), -(this.getPosition().y - this.j2d.scene.viewport.y));
            }

            frame = frame ? (frame - 1) : 0;

            context.drawImage(
                this.options.animation.imageMap.img,
                (this.options.animation.sourceX + (this.options.animation.sourceW * frame)),
                this.options.animation.sourceY,
                this.options.animation.sourceW,
                this.options.animation.sourceH,
                this.options.position.x - this.j2d.scene.viewport.x,
                this.options.position.y - this.j2d.scene.viewport.y,
                this.options.size.x, this.options.size.y);

            if (this.options.angle || this.options.flip.x || this.options.flip.y) {
                context.restore();
            }

            if (this.options.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    SpriteNode.prototype.setAnimation = function (id) {
        if (this.options.animation != id) {
            this.options.animation = id;
        }
    };

    return SpriteNode;
});
