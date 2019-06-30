import * as PIXI from 'pixi.js';

const maxWidth = 10;
let tcanvas = document.createElement("canvas");
tcanvas.width = maxWidth + 2;
tcanvas.height = 1;
let baseTexture = new PIXI.BaseTexture(tcanvas);
var context = tcanvas.getContext("2d");
context.fillStyle = "rgb(200,200,230)";
context.fillRect(1, 0, 1, 1);
var texture = new PIXI.Texture(baseTexture, PIXI.SCALE_MODES.LINEAR);
texture.frame = new PIXI.Rectangle(0, 0, 3, 1);
let cacheVal = texture;

function LineSprite() {
    PIXI.Sprite.call(this, cacheVal);
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.updatePosition();
    this.anchor.x = 0.5;
};

LineSprite.prototype = Object.create(PIXI.Sprite.prototype);
LineSprite.prototype.constructor = LineSprite;

LineSprite.prototype.updatePosition = function () {
    this.position.x = this.x1;
    this.position.y = this.y1;
    this.height = Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
    var dir = Math.atan2(this.y1 - this.y2, this.x1 - this.x2);
    this.rotation = Math.PI * 0.5 + dir;
};

export default LineSprite;
