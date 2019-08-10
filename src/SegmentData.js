import GeomUtils from "./canvas/geom_utils";
import Segment from "./Segment";
import Utils from "./canvas/utils";
import Rect from "./canvas/rect";
import RectUtils from "./canvas/rectutils";
import EventEmitter from 'events';
import Hash from './Hash';

class SegmentData extends EventEmitter{
    constructor(group, transform){
        super();
        this.group = group;
        this.baseSegments = [];
        this.allSegments = [];
        this.hash = new Hash();
        this.bounds = new Rect(
            Utils.PT(0,0),
            Utils.PT(1000, 0),
            Utils.PT(0, 480)
        );
        this.updateTransform(transform);
    }
    getClose(p, i){
        return this.hash.getClose(p, i);
    }
    generateAllSegments(){
        const segExists = (segs, newSeg)=>{
            for(let i = 0; i < segs.length; i++){
                if(segs[i].isCloseTo(newSeg)){
                    return true;
                }
            }
            return false;
        };
        this.allSegments = [];
        this.allTransforms.forEach(t=>{
            //const isIdentity = GeomUtils.isIdentity(t);
            this.baseSegments.forEach((segment, i)=>{
                const transformedSegment = GeomUtils.transformSegment(segment, t);
                transformedSegment.setBaseSegment(segment);
                transformedSegment._index = i;
                transformedSegment._i = t._i;
                transformedSegment._j = t._j;
                //transformedSegment.setIsBaseSegment(isIdentity);
                if(
                    RectUtils.rectContainsSegment(this.bounds, transformedSegment)
                    &&
                    !segExists(this.allSegments, transformedSegment)
                ){
                    this.allSegments.push(transformedSegment);
                }
            });
        });
    }
    generate(){
        this.generateAllSegments();
        this.hash.generate(this.allSegments);
    }
    getAllSegments(){
        return this.allSegments;
    }
    getAllTransforms(){
        return this.allTransforms;
    }
    updateTransform(trans){
        this.transform = trans;
        this.invTransform = GeomUtils.getInverse(this.transform);
        this.transformedBaseRect = this.group.baseRect.getTransformed(this.transform);
        this.baseTransforms = GeomUtils.composeAllWith(this.group.baseTransforms, this.transform);
        this.coverTransforms = this.transformedBaseRect.getTransformsForRect(this.bounds);
        this.allTransforms = GeomUtils.composeArrays(this.baseTransforms, this.coverTransforms);
        this.generate();
    }
    getNextIndex(){
        return this.baseSegments.length;
    }
    _getTransformToBaseRect(p){
        const mappingData = this.transformedBaseRect.getMappingData(p);
        const toTranslatedRect = GeomUtils.getTranslation(
            Utils.add(
                Utils.times(this.transformedBaseRect.v, -mappingData.lambda),
                Utils.times(this.transformedBaseRect.w, -mappingData.mu)
            )
        );
        const toBaseRect = GeomUtils.compose(toTranslatedRect, this.invTransform);
        const p0 = toBaseRect.apply(p);
        const toFundamentalRegion = this.group.getBaseTransform(p0);
        return GeomUtils.compose(toBaseRect, GeomUtils.getInverse(toFundamentalRegion));
    }
    _normalizeToBaseRect(start, diff){
        return GeomUtils.transformSegment(
            new Segment(start, diff),
            this._getTransformToBaseRect(start)
        );
    }
    remove(i){
        this.baseSegments.splice(i, 1);
        this.generate();
        this.emit("draw", this);
    }
    edit(i, start, diff){
        this.baseSegments[i] = this._normalizeToBaseRect(start, diff);
        this.generate();
        this.emit("draw", this);
    }
    add(start, diff){
        const segment = this._normalizeToBaseRect(start, diff);
        this.baseSegments.push(segment);
    }
}

export default SegmentData;
