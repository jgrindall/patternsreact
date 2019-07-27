import * as PIXI from 'pixi.js';

const SIZE = 6;

const getTexture = (clr)=>{
    let canvas = document.createElement("canvas");
    canvas.width = SIZE
    canvas.height = SIZE;
    var context = canvas.getContext("2d");
    context.fillStyle = clr;
    context.beginPath();
    if(clr === "red"){
        context.arc(SIZE/2, SIZE/2, SIZE/2, 0, 2*Math.PI);
    }
    else{
        context.rect(0, 0, SIZE, SIZE);
    }
    context.fill();
    const texture = new PIXI.Texture(new PIXI.BaseTexture(canvas), PIXI.SCALE_MODES.LINEAR);
    texture.frame = new PIXI.Rectangle(0, 0, SIZE, SIZE);
    return texture;
};

const redTexture = getTexture("red");
const greenTexture = getTexture("green");

function BlobSprite() {
    PIXI.Sprite.call(this, redTexture);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

BlobSprite.prototype = Object.create(PIXI.Sprite.prototype);
BlobSprite.prototype.constructor = BlobSprite;

BlobSprite.prototype.updatePosition = function (p) {
    this.position.x = p.x;
    this.position.y = p.y;
};

BlobSprite.prototype.updateScale = function(start){
    this.texture = (start ? redTexture : greenTexture);
};

export default BlobSprite;
