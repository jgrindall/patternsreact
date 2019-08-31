import GeomUtils from "./canvas/geom_utils";
import Segment from "./Segment";
import Utils from "./canvas/utils";
import Rect from "./canvas/Rect";
import EventEmitter from 'events';

class TransformData extends EventEmitter{
    constructor(group, transform){
        super();
        this.group = group;
        this.bounds = new Rect(
            Utils.PT(0,0),
            Utils.PT(1000, 0),
            Utils.PT(0, 480)
        );
        this.updateTransform(transform);
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
        this.emit("update");
    }
    normalizeToBaseRect(start, diff){
        return GeomUtils.transformSegment(
            new Segment(start, diff),
            this.getTransformToBaseRect(start)
        );
    }
    getTransformToBaseRect(p){
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
}

export default TransformData;
