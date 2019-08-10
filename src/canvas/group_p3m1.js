import GeomUtils from './geom_utils';
import Utils from './utils';
import Rect from './rect';
import * as PIXI from 'pixi.js';
const sideLen = 160;

const rt3 = Math.sqrt(3);
const dy = Utils.PT(0, sideLen);

const p = Utils.PT(sideLen*rt3/2, sideLen/2);
const p2 = Utils.add(p, dy);
const p3 = Utils.add(p2, dy);

const t0 = GeomUtils.getReflection(p, Math.PI/6)
const t1 = GeomUtils.getReflection(p, Math.PI/2)
const t2 = GeomUtils.getReflection(p, -Math.PI/6)
const t3 = GeomUtils.getReflection(p2, Math.PI/6)
const t4 = GeomUtils.getReflection(p2, -Math.PI/6)
const t5 = GeomUtils.getReflection(p3, Math.PI/6)
const t6 = GeomUtils.getReflection(p3, -Math.PI/6)
const id = GeomUtils.getIdentity();

const groupP3M1 = {
    name:"p3m1",
    baseRect: new Rect(Utils.PT(0, 0), Utils.PT(sideLen*rt3, 0), Utils.PT(0, 3*sideLen)),
    fundamentalPolygon:new PIXI.Polygon([
        Utils.PT(0, 0),
        p,
        Utils.PT(0, sideLen)
    ]),
    getBaseTransform:function(pos){
        if(pos.x < 0 || pos.y < 0 || pos.x > sideLen*rt3 || pos.y > 3*sideLen){
            throw new Error("outside");
        }
        // indeterminate cases
        for(let i = 0; i < this.transformedPolys.length; i++){
            if(this.transformedPolys[i].contains(pos.x, pos.y)){
                //if(i === 0 )
                return this.baseTransforms[i];
            }
        }
        throw new Error("not found");
    },
    baseTransforms:[
        id,
        t0,
        GeomUtils.compose(t0, t1),
        t1,
        GeomUtils.compose(t1, t0),
        t2,
        GeomUtils.compose(t2, t3),
        GeomUtils.compose(t2, t3, t1),
        GeomUtils.compose(t2, t3, t4),
        t4,
        GeomUtils.compose(t2, t4),
        GeomUtils.compose(t2, t3, t4, t5),
        GeomUtils.compose(t2, t3, t4, t5, t6),
        GeomUtils.compose(t2, t3, t4, t6)
    ]

}

groupP3M1.transformedPolys = groupP3M1.baseTransforms.map(t=>{
    return GeomUtils.transformPoly(groupP3M1.fundamentalPolygon, t);
});

export default groupP3M1;
