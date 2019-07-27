
import Utils from './canvas/utils';

class CDrawTool{
    constructor(comp){
        this.comp = comp;
        this.state = "idle";
    }
    onMouseDown(e){
        this.p = Utils.PT(e.pageX, e.pageY);
        this.state = "drawing";
        this.i = this.comp.list.segs.length;
        this.seg = this.comp.list.add(this.p, Utils.PT(0, 0));
    }
    onMouseMove(e){
        if(this.state === "drawing"){
            const p = Utils.PT(e.pageX, e.pageY);
            this.comp.list.edit(this.i, this.p, Utils.pToQ(this.p, p));
            this.comp.draw();
        }
    }
    onMouseUp(e){
        if(this.state === "drawing"){
            this.state = "idle";
        }
    }
};

export default CDrawTool;
