import * as PIXI from 'pixi.js';
import LineSprite from './linesprite';

let pixi;
let drawingGfx;
let stage;
let constructionContainer;
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
		realContainer = new PIXI.Container();
		drawingContainer = new PIXI.Container();
	    drawingGfx = new PIXI.Graphics();
		drawingGfx.x = 0;
		drawingGfx.y = 0;
		stage.addChild(constructionContainer);
		stage.addChild(realContainer);
		stage.addChild(drawingContainer);
		drawingContainer.addChild(drawingGfx);
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
	update:(segs, type)=>{
		segs = _clean(segs);
		let container = (type === "cons" ? constructionContainer : realContainer);
		let color = (type === "cons" ? "black" : "blue");
		let n = container.children.length;
		const tar = segs.length;
		while(n < tar){
			container.addChild(new LineSprite(color));
			n++;
		}
		n = container.children.length;
		for(var i = 0; i < n; i++){
			if(i < tar){
				container.children[i].updatePosition(segs[i]);
			}
			container.children[i].visible = (i < tar);
		}
	}
}

export default netRenderer;
