
import Utils from './canvas/utils';
import GeomUtils from './canvas/geom_utils';
import renderer from './canvas/renderer';
import _ from "lodash";


class TransformTool{
    constructor(comp){
        this.comp = comp;
    }
    onMouseDown(e){
        this.transforming = true;
        this.p = Utils.PT(e.pageX, e.pageY);
    }
    onMouseMove(e){
        if(this.transforming){
            const p = Utils.PT(e.pageX, e.pageY);
            const scale = Math.sqrt(Math.abs(GeomUtils.getDet(this.comp.trans)));
            console.log(scale);
            const t = GeomUtils.getTranslation((p.x - this.p.x)/scale, (p.y - this.p.y)/scale);
            this.p = p;
            const newTrans = GeomUtils.compose(t, this.comp.trans);
            this.comp.trans = newTrans
            this.comp.list.updateTransform(newTrans);
            this.comp.draw();
        }
    }
    onMouseUp(e){
        if(this.transforming){
            this.transforming = false;
        }
    }
};

export default TransformTool;
