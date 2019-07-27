
import GeomUtils from './canvas/geom_utils';
import Utils from './canvas/utils';
import _ from "lodash";


class SelectTool{
    constructor(comp){
        this.comp = comp;
    }
    onMouseDown(e){
        const p = Utils.PT(e.pageX, e.pageY);
        this.editing = this.comp.list.getClose(p);
    }
    edit(p){
        let newStart, newDiff, newEnd;
        if(this.editing.type === "end"){
            newStart = this.editing.seg.start;
            newDiff = Utils.pToQ(newStart, p);
        }
        else{
            newEnd = this.editing.seg.end;
            newStart = p;
            newDiff = Utils.pToQ(newStart, newEnd);
        }
        this.comp.list.edit(this.editing.index, newStart, newDiff);
        this.comp.draw();
    }
    onMouseMove(e){
        const p = Utils.PT(e.pageX, e.pageY);
        if(this.editing){
            this.edit(p);
        }
    }
    onMouseUp(e){
        if(this.editing){
            let p = Utils.PT(e.pageX, e.pageY);
            const close = this.comp.list.getClose(p);
            if(close){
                p = close.location;
            }
            this.edit(p);
            this.editing = false;
        }
    }
};

export default SelectTool;
