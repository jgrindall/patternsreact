
import Utils from './canvas/utils';

class SelectTool{
    constructor(segmentData){
        this.segmentData = segmentData;
    }
    onMouseDown(e){
        const p = Utils.PT(e.pageX, e.pageY);
        this.editing = this.segmentData.getClose(p);
        console.log(this.editing.data);
    }
    edit(p, snap){
        let newStart, newDiff, newEnd;
        if(this.editing.data.custom.type === "end"){
            newStart = this.editing.data.custom.segment.start;
            newDiff = Utils.pToQ(newStart, p);
            if(snap){
                newEnd = p;
                console.log('snap', newEnd);
                newEnd = this.segmentData.getClose(newEnd, this.editing.data.custom.segment._index);
                console.log('snap', newEnd);
                newDiff = Utils.pToQ(newStart, newEnd);
            }
        }
        else{
            newEnd = this.editing.data.custom.segment.end;
            newStart = p;
            newDiff = Utils.pToQ(newStart, newEnd);
            if(snap){
                newStart = this.segmentData.getClose(newStart, this.editing.data.custom.segment._index);
                newDiff = Utils.pToQ(newStart, newEnd);
            }
        }
        this.segmentData.edit(this.editing.data.custom.segment._index, newStart, newDiff);
    }
    onMouseMove(e){
        if(this.editing && this.editing.data && this.editing.data.custom){
            const p = Utils.PT(e.pageX, e.pageY);
            this.edit(p);
        }
    }
    onMouseUp(e){
        if(this.editing && this.editing.data && this.editing.data.custom){
            let p = Utils.PT(e.pageX, e.pageY);
            p = this.segmentData.getClose(p);
            this.edit(p, true);
            this.editing = false;
        }
    }
};

export default SelectTool;
