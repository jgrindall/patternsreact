
import Utils from './canvas/utils';
import _ from "lodash";


class DrawTool{
    constructor(comp){
        this.comp = comp;
        this.state = "idle";
    }
    onMouseDown(e){
        this.p0 = Utils.PT(e.pageX, e.pageY);
        const close = this.comp.list.getClose(this.p0);
        if(close){
            this.p0 = close.location;
        }
        this.state = "drawing";
        this.index = this.comp.list.getNextIndex();
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
        if(this.state === "drawing"){
            this.state = "idle";
            let p1 = Utils.PT(e.pageX, e.pageY);
            const close = this.comp.list.getClose(p1);
            if(close){
                p1 = close.location;
            }
            if(Utils.getDistSqr(this.p0, p1) >= 1){
                this._edit(p1);
            }
            else{
                this._remove();
            }
        }
    }
};

export default DrawTool;
