import GeomUtils from "./canvas/geom_utils";
import Segment from "./Segment";
import Utils from "./canvas/utils";
import Rect from "./canvas/rect";
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
            Utils.PT(1024, 0),
            Utils.PT(0, 600)
        );
        this.updateTransform(transform);
    }
    getClose(p, i){
        return this.hash.getClose(p, i);
    }
    generateAllSegments(){
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
                this.allSegments.push(transformedSegment);
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
        const baseTransforms = GeomUtils.composeAllWith(this.group.baseTransforms, this.transform);
        const transfomedRect = this.group.baseRect.getTransformed(this.transform);
        const coverTransforms = transfomedRect.getTransformsForRect(this.bounds);
        this.allTransforms = GeomUtils.composeArrays(baseTransforms, coverTransforms);
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
