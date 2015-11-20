/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.4
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

define('j2d.sprite', [
    'jquery.j2d',
    'j2d.base'
], function (J2D, BaseNode) {
    "use strict";

    if (!J2D.prototype.scene.addSpriteNode) {
        J2D.prototype.scene.addSpriteNode = function (pos, size, animation) {
            return new SpriteNode(this.parent, pos, size, animation);
        };
    }

    var SpriteNode = function (j2d, pos, size, animation) {

        BaseNode.call(this, j2d, pos, size);

        this.tmpSpeed = 0;
        this.frame = 0;
        this.animation = animation;
        this.flip = {x: false, y: false};
    };

    SpriteNode.prototype = Object.create(BaseNode.prototype);
    SpriteNode.prototype.constructor = SpriteNode;

    SpriteNode.prototype.setFlip = function (x, y) {
        this.flip = {x: x, y: y};
    };

    SpriteNode.prototype.draw = function (speed) {
        if (this.visible && this.isLookScene()) {
            speed = speed || 1;

            if (this.frame > this.animation.frameCount) {
                this.frame = 0;
            }
            this.drawFrame(this.frame + 1);

            if (this.tmpSpeed > speed) {
                this.frame += 1;
                this.tmpSpeed = 0;
            }
            else {
                this.tmpSpeed += 1;
            }
        }
    };

    // отрисовка одного кадра
    SpriteNode.prototype.drawFrame = function (frame) {
        var context = this.layer.context;
        if (this.visible && this.isLookScene()) {

            if (this.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.alpha;
            }

            context.lineWidth = 0;

            if (this.angle || this.flip.x || this.flip.y) {
                context.save();
                context.translate(this.getPosition().x - this.j2d.scene.view.x, this.getPosition().y - this.j2d.scene.view.y);
                context.rotate(this.j2d.math.rad(this.angle));
                context.scale(this.flip.x ? -1 : 1, this.flip.y ? -1 : 1);
                context.translate(-(this.getPosition().x - this.j2d.scene.view.x), -(this.getPosition().y - this.j2d.scene.view.y));
            }

            frame = frame ? (frame - 1) : 0;

            context.drawImage(
                this.animation.imageMap.img,
                (this.animation.sourceX + (this.animation.sourceW * frame)), this.animation.sourceY,
                this.animation.sourceW, this.animation.sourceH,
                this.pos.x - this.j2d.scene.view.x, this.pos.y - this.j2d.scene.view.y,
                this.size.x, this.size.y);

            if (this.angle || this.flip.x || this.flip.y) {
                context.restore();
            }

            if (this.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    SpriteNode.prototype.setAnimation = function (id) {
        if (this.animation != id) {
            this.animation = id;
        }
    };

    return SpriteNode;
});
