
import GeomUtils from './geom_utils';
import Utils from './utils';
import groupP3M1 from './group_p3m1';
import Rect from './rect';
import renderer from './renderer';
import _ from "lodash";

const gp = groupP3M1;

const Drawer = {
    init:(c)=>{
        renderer.init(c);
    },
    update: ()=>{

        const trans = GeomUtils.compose(
            GeomUtils.getTranslation(300*Math.random(), 50),
            GeomUtils.getScale(1.5 + Math.random()*0.5),
            GeomUtils.getRotationAboutOrigin(Math.random())
        );

        const baseTransforms = _.map(gp.baseTransforms, t=>{
            return GeomUtils.compose(t, trans);
        })

        const tRect = gp.baseRect.getTransformed(trans);

        const bounds = new Rect(Utils.PT(), Utils.PT(1024, 0), Utils.PT(0, 600))

        const coverTransforms = tRect.getTransformsForRect(bounds)

        const allT = [];

        const lineSegments = _.map(_.range(20), i=>{
            return [
                {x:Math.random()*1024, y:Math.random()*600},
                {x:Math.random()*1024, y:Math.random()*600}
            ]
        });

        const allSeg = [];

        _.each(coverTransforms, coverT=>{
            _.each(baseTransforms, (baseTransform)=>{
                allT.push(GeomUtils.compose(baseTransform, coverT));
            });
        });

        for(let i = 0; i < allT.length; i++){
            for(let j = 0; j < lineSegments.length; j++){
                allSeg.push(GeomUtils.transformSegment(lineSegments[j], allT[i]))
            }
        }

        //console.log(allSeg)

        renderer.update(allSeg);

    }
};

export default Drawer;


//$(window).on("mousemove", update);
