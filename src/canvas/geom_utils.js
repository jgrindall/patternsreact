import * as PIXI from 'pixi.js';
import _ from 'lodash';

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

const getPt = (segs, p)=>{
    const TOL = 20;
    const candidates = [];
    let dx, dy;
    for(let seg of segs){
        dx = Math.abs(seg[0].x  - p.x);
        dy = Math.abs(seg[0].y  - p.y);
        if(dx < TOL && dy < TOL){
            candidates.push({pt:seg[0], dx:dx, dy:dy});
        }
        dx = Math.abs(seg[1].x  - p.x);
        dy = Math.abs(seg[1].y  - p.y);
        if(dx < TOL && dy < TOL){
            candidates.push({pt:seg[1], dx:dx, dy:dy});
        }
    }
    if(candidates.length >= 1){
        console.log('c', candidates);
        const sorted = _.sortBy(candidates, c=> c.dx + c.dy);
        console.log('s', sorted);
        return sorted[0].pt;
    }
    return p;
}

const transformSegment = (segment, t)=>{
    return [
        t.apply(segment[0]),
        t.apply(segment[1])
    ]
};

const GeomUtils = {
    compose:compose,
    getTranslation:getTranslation,
    getScale: getScale,
    getRotationAboutOrigin:getRotationAboutOrigin,
    getInverse:getInverse,
    getReflectionOrigin:getReflectionOrigin,
    getReflection:getReflection,
    getMatrix:getMatrix,
    getIdentity:getIdentity,
    transformSegment:transformSegment,
    getPt:getPt
};

export default GeomUtils;
