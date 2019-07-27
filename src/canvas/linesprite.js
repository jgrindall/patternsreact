import * as PIXI from 'pixi.js';

const PI2 = Math.PI/2;
const maxWidth = 10;

const getTexture = (clr)=>{
    let canvas = document.createElement("canvas");
    canvas.width = maxWidth + 2;
    canvas.height = 1;
    var context = canvas.getContext("2d");
    context.fillStyle = clr;
    context.fillRect(1, 0, 1, 1);
    const texture = new PIXI.Texture(new PIXI.BaseTexture(canvas), PIXI.SCALE_MODES.LINEAR);
    texture.frame = new PIXI.Rectangle(0, 0, 3, 1);
    return texture;
};

const blackTexture = getTexture("rgba(20,20,20, 0.7)");
const blueTexture = getTexture("rgba(20,20,220, 0.7)");


function LineSprite(color) {
    let texture = color === "black" ? blackTexture : blueTexture;
    PIXI.Sprite.call(this, texture);
    this.anchor.x = 0.5;
};

LineSprite.prototype = Object.create(PIXI.Sprite.prototype);
LineSprite.prototype.constructor = LineSprite;

LineSprite.prototype.updatePosition = function (seg) {
    const x1 = seg.start.x;
    const y1 = seg.start.y;
    const x2 = seg.end.x;
    const y2 = seg.end.y;
    this.position.x = x1;
    this.position.y = y1;
    this.height = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var dir = Math.atan2(y1 - y2, x1 - x2);
    this.rotation = PI2 + dir;
};

export default LineSprite;
