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
    /*
    setIsBaseSegment(isBase){
        this.isBase = isBase;
    }
    getIsBaseSegment(){
        return this.isBase;
    }
    */
}

export default Segment;
