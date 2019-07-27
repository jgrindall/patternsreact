import * as PIXI from 'pixi.js';
import Segment from '../Segment';
import Utils from './utils';

const _compose = (a, b)=>{
    // a then b
    return b.clone().append(a);
};

const compose = (...args)=>{
    const ctx = this;
    if(args.length <= 1){
        throw new Error("ONE!?!!?");
    }
    if(args.length === 2){
        return _compose(args[0], args[1]);
    }
    const last = args.pop();
    const firsts = compose.call(ctx, ...args);
    return _compose(firsts, last);
};

const composeAllWith = (a, followedBy) => a.map(t=>{
    return compose(t, followedBy);
});

const getTranslation = function(x, y){
    if(arguments.length === 1 && typeof arguments[0] === "object"){
        return new PIXI.Matrix(1, 0, 0, 1, x.x, x.y);
    }
    else{
        return new PIXI.Matrix(1, 0, 0, 1, x, y);
    }
}

const getScale = (s) =>{
    return new PIXI.Matrix(s, 0, 0, s, 0, 0);
}

const getRotationAboutOrigin = (angleRad) =>{
    const c = Math.cos(angleRad);
    const s = Math.sin(angleRad);
    return new PIXI.Matrix(c, s, -s, c, 0, 0);
}

const getInverse = (m)=>m.clone().invert();

const getReflectionOrigin = (angleRad)=>{
    const cosTheta = Math.cos(angleRad), sinTheta = Math.sin(angleRad);
    const cos2Theta = cosTheta*cosTheta - sinTheta*sinTheta;
    const sin2Theta = 2*sinTheta*cosTheta;
    return getMatrix(cos2Theta, sin2Theta, sin2Theta, -cos2Theta, 0, 0);
};

const getReflection = (pt, angleRad)=>{
    const refOrigin = getReflectionOrigin(angleRad);
    let t = getTranslation(pt);
    return compose(getInverse(t), refOrigin, t);
};

const getMatrix=(a, b, c, d, tx, ty)=>{
    return new PIXI.Matrix(a, b, c, d, tx, ty);
};

const getIdentity = ()=>{
    return new PIXI.Matrix();
};

const isIdentity = (m)=>{
    return (m.b === 0 && m.c === 0 && m.a === 1 && m.d === 1 && m.tx === 0 && m.ty === 0);
};

const transformSegment = (segment, t)=>{
    const p0 = t.apply(segment.start);
    const p1 = t.apply(Utils.add(segment.start, segment.diff));
    return new Segment(p0, Utils.pMinusQ(p1, p0));
};

const transformPoly = (poly, t)=>{
    let ptsFlat = poly.points;
    let pts = []
    for (let i = 0; i < ptsFlat.length; i+=2){
        pts.push(Utils.PT(ptsFlat[i], ptsFlat[i + 1]));
    }
    const transPoints = pts.map(p=>t.apply(p));
    return new PIXI.Polygon(transPoints);
};

const getDet = t=>{
    return t.a*t.d - t.b*t.c;
};

const composeArrays = (arr1, arr2)=>{
    const all = [];
    arr1.forEach(t1=>{
        arr2.forEach(t2=>{
            all.push(GeomUtils.compose(t1, t2));
        });
    });
    return all;
};

const GeomUtils = {
    compose:compose,
    isIdentity:isIdentity,
    composeAllWith:composeAllWith,
    composeArrays:composeArrays,
    getTranslation:getTranslation,
    getScale: getScale,
    getRotationAboutOrigin:getRotationAboutOrigin,
    getInverse:getInverse,
    getReflectionOrigin:getReflectionOrigin,
    getReflection:getReflection,
    getMatrix:getMatrix,
    getIdentity:getIdentity,
    transformSegment:transformSegment,
    transformPoly:transformPoly,
    getDet:getDet
};

export default GeomUtils;
