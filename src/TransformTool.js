
import Utils from './canvas/utils';
import GeomUtils from './canvas/geom_utils';

class TransformTool{
    constructor(transformData){
        this.transformData = transformData;
    }
    onMouseDown(e){
        this.transforming = true;
        this.p = Utils.PT(e.pageX, e.pageY);
    }
    onMouseMove(e){
        if(this.transforming){
            const trans = this.transformData.transform;
            const p = Utils.PT(e.pageX, e.pageY);
            const scale = Math.sqrt(Math.abs(GeomUtils.getDet(trans)));
            const t = GeomUtils.getTranslation((p.x - this.p.x)/scale, (p.y - this.p.y)/scale);
            this.p = p;
            const newTrans = GeomUtils.compose(t, trans);
            this.transformData.updateTransform(newTrans);
        }
    }
    onMouseUp(e){
        if(this.transforming){
            this.transforming = false;
        }
    }
};

export default TransformTool;
