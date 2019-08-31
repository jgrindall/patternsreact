
import Utils from './canvas/utils';

class DrawTool{
    constructor(segmentData){
        this.segmentData = segmentData;
        this.state = "idle";
    }
    onMouseDown(e){
        this.p0 = Utils.PT(e.pageX, e.pageY);
        this.state = "drawing";
        this.index = this.segmentData.getNextIndex();
        this.p0 = this.segmentData.getClose(this.p0);
        this.segmentData.add(this.p0, Utils.PT(0, 0));
    }
    _edit(p1){
        this.segmentData.edit(this.index, this.p0, Utils.pToQ(this.p0, p1));
    }
    _remove(){
        this.segmentData.remove(this.index);
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
            p1 = this.segmentData.getClose(p1, this.index)
            if(Utils.getDistSqr(this.p0, p1) >= MIN_LENGTH){
                this._edit(p1);
            }
            else{
                this._remove();
            }
        }
        this.state = "idle";
    }
};

export default DrawTool;
