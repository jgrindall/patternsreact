import * as PIXI from 'pixi.js';
import LineSprite from './linesprite';

let pixi;
let drawingGfx;
let stage;
let constructionContainer;
let drawingContainer;

const netRenderer = {
	init:(c)=>{
		console.log("init", c);
		pixi = PIXI.autoDetectRenderer(1024, 600, {view:c, antialias: false, forceFXAA: false});
	    stage = new PIXI.Container();
	    constructionContainer = new PIXI.Container();
		drawingContainer = new PIXI.Container();
	    drawingGfx = new PIXI.Graphics();
		drawingGfx.x = 0;
		drawingGfx.y = 0;
		stage.addChild(constructionContainer);
		stage.addChild(drawingContainer);
		drawingContainer.addChild(drawingGfx);
		var render = ()=>{
			pixi.render(stage);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);
	},
	draw:(seg, sprite)=>{
        sprite.updatePosition(seg);
	},
	reset:()=>{

	},
	clearLine:()=>{
		drawingGfx.clear();
	},
	drawLine:(p0, p1)=>{
		drawingGfx.clear().lineStyle(2, 0xff0000)
       .moveTo(p0.x, p0.y)
       .lineTo(p1.x, p1.y);
   },
	update:(segs)=>{
		console.log(3, segs.length)
		let n = constructionContainer.children.length;
		const tar = segs.length;
		while(n < tar){
			constructionContainer.addChild(new LineSprite());
			n++;
		}
		n = constructionContainer.children.length;
		for(var i = 0; i < n; i++){
			if(i < tar){
				netRenderer.draw(segs[i], constructionContainer.children[i]);
			}
			constructionContainer.children[i].visible = (i < tar);
		}
	}
}

export default netRenderer;
