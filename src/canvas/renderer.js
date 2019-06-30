import * as PIXI from 'pixi.js';
import LineSprite from './linesprite';

let pixi;
let gfx;
let stage;

const count = 1000;
let container;

const netRenderer = {
	init:(c)=>{
		console.log('init!!!!')
		pixi = PIXI.autoDetectRenderer(1024, 600, {view:c, antialias: false, forceFXAA: false});
		//document.body.appendChild(pixi.view);
	    stage = new PIXI.Container();
	    container = new PIXI.Container();
	    gfx = new PIXI.Graphics();
		stage.addChild(container);
		stage.addChild(gfx);
		for (let i = 0; i < count; i++) {
        	container.addChild(new LineSprite());
    	}
		var render = ()=>{
			pixi.render(stage);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);
	},
	draw:(seg, sprite)=>{
		sprite.x1 = seg[0].x;
        sprite.y1 = seg[0].y;
        sprite.x2 = seg[1].x;
        sprite.y2 = seg[1].y;
        sprite.updatePosition();
	},
	reset:()=>{

	},
	update:(segs)=>{
		let n = container.children.length;
		const tar = segs.length;
		if(n < tar){
			// add more
			while(n < tar){
				container.addChild(new LineSprite());
				n++;
			}
		}
		n = container.children.length;
		for(var i = 0; i < n; i++){
			if(i < tar){
				netRenderer.draw(segs[i], container.children[i]);
			}
			container.children[i].visible = (i < tar);
		}
	}
}

export default netRenderer;
