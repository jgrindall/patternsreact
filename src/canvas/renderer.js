import * as PIXI from 'pixi.js';
import LineSprite from './LineSprite';
import BlobSprite from './BlobSprite';

class Layer{
	constructor(clr){
		this.clr = clr;
		this.container = new PIXI.Container();
		this.segsContainer = new PIXI.Container();
		this.ptsContainer = new PIXI.Container();
		this.container.addChild(this.segsContainer);
		this.container.addChild(this.ptsContainer);
	}
	makeChildren(container, num, maker){
		let numChildren = container.children.length;
		let max = Math.max(numChildren, num);
		for(let i = 0; i < max; i++){
			let child = container.children[i];
			if(!child){
				child = maker();
				container.addChild(child);
			}
			child.visible = (i < num);
		}
	}
	update(segs){
		let targetNumSegs = segs.length;
		let targetNumPts = targetNumSegs*2;
		this.makeChildren(this.segsContainer, targetNumSegs, ()=>{
			return new LineSprite(this.clr);
		});
		this.makeChildren(this.ptsContainer, targetNumPts, ()=>{
			return new BlobSprite();
		});
		for(let i = 0; i < targetNumSegs; i++){
			let seg = segs[i];
			let start = seg.start;
			let end = seg.end;
			this.segsContainer.children[i].updatePosition(seg);
			this.ptsContainer.children[2*i].updatePosition(start);
			this.ptsContainer.children[2*i + 1].updatePosition(end);
		}
	}
}

class Renderer{
	init(canvas){
		this.renderer = PIXI.autoDetectRenderer(canvas.width, canvas.height,
			{
				view:canvas,
				backgroundColor: 0xdddddd,
				antialias: false,
				forceFXAA: false
			}
		);
	    this.stage = new PIXI.Container();
		this.layer1 = new Layer("black");
		this.layer2 = new Layer("blue");
		this.stage.addChild(this.layer1.container);
		this.stage.addChild(this.layer2.container);
		this.drawingContainer = new PIXI.Container();
	    this.drawingGfx = new PIXI.Graphics();
		this.drawingGfx.x = 0;
		this.drawingGfx.y = 0;
		this.stage.addChild(this.drawingContainer);
		this.drawingContainer.addChild(this.drawingGfx);
	}
	clearLine(){
		this.drawingGfx.clear();
	}
	drawLine(p0, p1){
		this.drawingGfx.clear().lineStyle(2, 0xff0000)
       .moveTo(p0.x, p0.y)
       .lineTo(p1.x, p1.y);
   	}
	drawRects(rect, ct){
		this.drawingGfx.clear().lineStyle(2, 0xff0000);
		ct.forEach(t=>{
			this.drawRect(rect.getTransformed(t));
		});
	}
   	drawRect(rect){
	   	this.drawingGfx.moveTo(rect.p.x, rect.p.y)
	  	.lineTo(rect.p.x + rect.v.x, rect.p.y + rect.v.y)
		.lineTo(rect.p.x + rect.v.x + rect.w.x, rect.p.y + rect.v.y + rect.w.y)
		.lineTo(rect.p.x + rect.w.x, rect.p.y + rect.w.y)
		.lineTo(rect.p.x, rect.p.y);
    }
	update(segs1, segs2, rect, ct){
		this.drawRects(rect, ct);
		this.layer1.update(segs1);
		this.layer2.update(segs2);
		window.requestAnimationFrame(()=>{
			this.renderer.render(this.stage);
		});
	}
}

export default new Renderer();
