import GeomUtils from "./canvas/geom_utils";
import EventEmitter from 'events';
import Hash from './Hash';

class SegmentData extends EventEmitter{
    constructor(transformData){
        super();
        this.transformData = transformData;
        this.baseSegments = [];
        this.allSegments = [];
        this.hash = new Hash();
        this.transformData.on("update", this.generate.bind(this));
        this.generate();
    }
    getClose(p, i){
        return this.hash.getClose(p, i);
    }
    _generateAllSegments(){
        this.allSegments = [];
        this.transformData.getAllTransforms().forEach(t=>{
            this.baseSegments.forEach((segment, i)=>{
                const transformedSegment = GeomUtils.transformSegment(segment, t);
                transformedSegment.setBaseSegment(segment);
                transformedSegment._index = i;
                transformedSegment._i = t._i;
                transformedSegment._j = t._j;
                this.allSegments.push(transformedSegment);
            });
        });
    }
    generate(){
        this._generateAllSegments();
        this.hash.generate(this.allSegments);
        this.emit("draw", this);
    }
    getAllSegments(){
        return this.allSegments;
    }
    getNextIndex(){
        return this.baseSegments.length;
    }
    remove(i){
        this.baseSegments.splice(i, 1);
        this.generate();
    }
    edit(i, start, diff){
        this.baseSegments[i] = this.transformData.normalizeToBaseRect(start, diff);
        this.generate();

    }
    add(start, diff){
        const segment = this.transformData.normalizeToBaseRect(start, diff);
        this.baseSegments.push(segment);
    }
}

export default SegmentData;
