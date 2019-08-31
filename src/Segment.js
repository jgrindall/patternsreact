import Utils from "./canvas/utils";

class Segment{
    constructor(start, diff){
        this.start = start;
        this.diff = diff;
        this.end = Utils.add(start, diff);
    }
    setBaseSegment(seg){
        this.base = seg;
    }
    getBaseSegment(){
        return this.base;
    }
    isCloseTo(segment){
        const s0 = this.start;
        const e0 = this.end;
        const s1 = segment.start;
        const e1 = segment.end;
        return (
            (Utils.closeTo(s0, s1, 10) && Utils.closeTo(e0, e1, 10))
            ||
            (Utils.closeTo(s0, e1, 10) && Utils.closeTo(e0, s1, 10))
        );
    }
}

export default Segment;
