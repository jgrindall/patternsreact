import * as PIXI from 'pixi.js';
import LineSprite from './linesprite';
import BlobSprite from './blobsprite';

let pixi;
let drawingGfx;
//let ptsGfx;
let stage;
let constructionContainer;
let ptsContainer;
let realContainer;
let drawingContainer;

const _clean = segs=>{
	return segs;
};

const netRenderer = {
	init:(canvas)=>{
		pixi = PIXI.autoDetectRenderer(canvas.width, canvas.height,
			{
				view:canvas,
				backgroundColor: 0xdddddd,
				antialias: false,
				forceFXAA: false
			}
		);
	    stage = new PIXI.Container();
	    constructionContainer = new PIXI.Container();
		ptsContainer = new PIXI.Container();
		realContainer = new PIXI.Container();
		drawingContainer = new PIXI.Container();
	    drawingGfx = new PIXI.Graphics();
		drawingGfx.x = 0;
		drawingGfx.y = 0;
		//ptsGfx = new PIXI.Graphics();
		//ptsGfx.x = 0;
		//ptsGfx.y = 0;
		stage.addChild(constructionContainer);
		stage.addChild(ptsContainer);
		stage.addChild(realContainer);
		stage.addChild(drawingContainer);
		drawingContainer.addChild(drawingGfx);
		//ptsContainer.addChild(ptsGfx);
		var render = ()=>{
			pixi.render(stage);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);
	},
	clearLine:()=>{
		drawingGfx.clear();
	},
	drawLine:(p0, p1)=>{
		drawingGfx.clear().lineStyle(2, 0xff0000)
       .moveTo(p0.x, p0.y)
       .lineTo(p1.x, p1.y);
   },
	update:(segs, hash, tool)=>{
		segs = _clean(segs);
		let container = constructionContainer;
		let color = (tool === "drawc" ? "black" : "blue");
		color = color || "red";
		let num = container.children.length;
		let targetNum = segs.length;
		while(num < targetNum){
			container.addChild(new LineSprite(color));
			num++;
		}
		num = container.children.length;
		for(var i = 0; i < num; i++){
			if(i < targetNum){
				container.children[i].updatePosition(segs[i]);
			}
			container.children[i].visible = (i < targetNum);
		}
		container = ptsContainer;
		num = container.children.length;
		targetNum = hash.pointHash.length;
		while(num < targetNum){
			container.addChild(new BlobSprite());
			num++;
		}
		num = container.children.length;
		for(var i = 0; i < num; i++){
			if(i < targetNum){
				container.children[i].updatePosition(hash.pointHash[i].location);
				container.children[i].updateScale(hash.pointHash[i].type === "start");
			}
			container.children[i].visible = (i < targetNum);
		}

	}
}

export default netRenderer;
