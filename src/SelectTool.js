
import Utils from './canvas/utils';

class SelectTool{
    constructor(comp){
        this.comp = comp;
    }
    onMouseDown(e){
        const p = Utils.PT(e.pageX, e.pageY);
        this.editing = this.comp.list.getClose(p);
        console.log(this.editing.data);
    }
    edit(p, snap){
        //console.log(this.editing);
        let newStart, newDiff, newEnd;
        if(this.editing.data.custom.type === "end"){
            newStart = this.editing.data.custom.segment.start;
            //console.log(newStart, p);
            newDiff = Utils.pToQ(newStart, p);
            if(snap){
                newEnd = p;
                console.log('snap', newEnd);
                newEnd = this.comp.list.getClose(newEnd, this.editing.data.custom.segment._index);
                console.log('snap', newEnd);
                newDiff = Utils.pToQ(newStart, newEnd);
            }
        }
        else{
            newEnd = this.editing.data.custom.segment.end;
            newStart = p;
            //console.log(newStart, newEnd);
            newDiff = Utils.pToQ(newStart, newEnd);
            if(snap){
                newStart = this.comp.list.getClose(newStart, this.editing.data.custom.segment._index);
                newDiff = Utils.pToQ(newStart, newEnd);
            }
        }
        this.comp.list.edit(this.editing.data.custom.segment._index, newStart, newDiff);
        this.comp.draw();
    }
    onMouseMove(e){
        if(this.editing && this.editing.data && this.editing.data.custom){
            const p = Utils.PT(e.pageX, e.pageY);
            //console.log('edit', p)
            this.edit(p);
        }
    }
    onMouseUp(e){
        if(this.editing && this.editing.data && this.editing.data.custom){
            let p = Utils.PT(e.pageX, e.pageY);
            p = this.comp.list.getClose(p);
            this.edit(p, true);
            this.editing = false;
        }
        /*
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

        */
    }
};

export default SelectTool;
