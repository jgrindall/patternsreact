
import Utils from './canvas/utils';

class DrawTool{
    constructor(comp){
        this.comp = comp;
        this.state = "idle";
    }
    onMouseDown(e){
        this.p0 = Utils.PT(e.pageX, e.pageY);
        this.state = "drawing";
        this.index = this.comp.list.getNextIndex();
        this.p0 = this.comp.list.getClose(this.p0);
        this.comp.list.add(this.p0, Utils.PT(0, 0));
    }
    _edit(p1){
        this.comp.list.edit(this.index, this.p0, Utils.pToQ(this.p0, p1));
    }
    _remove(){
        this.comp.list.remove(this.index);
    }
    onMouseMove(e){
        if(this.state === "drawing"){
            this._edit(Utils.PT(e.pageX, e.pageY));
        }
    }
    onMouseUp(e){
        const MIN_LENGTH = 5;
        if(this.state === "drawing"){
            this.state = "idle";
            let p1 = Utils.PT(e.pageX, e.pageY);
            p1 = this.comp.list.getClose(p1, this.index)
            if(Utils.getDistSqr(this.p0, p1) >= MIN_LENGTH){
                this._edit(p1);
            }
            else{
                this._remove();
            }
        }
    }
};

export default DrawTool;
