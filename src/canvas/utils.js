import GeomUtils from './geom_utils';
import * as PIXI from 'pixi.js';

const PT = function(x, y){
    if(arguments.length === 0){
        return new PIXI.Point(0, 0);
    }
    else if(arguments.length === 1 && typeof arguments[0] === "object"){
        return new PIXI.Point(x)
    }
    return new PIXI.Point(x, y)
};

const add = (...a) => {
    const origin = PT();
    if(a.length <= 1){
        throw new Error("add");
    }
    if(a.length === 2){
        return _add(a[0], a[1]);
    }
    return a.reduce((previous, current) => {
        return _add(previous, current);
    }, origin);
}

const times = (p, n)=>{
    return {
        x:p.x * n,
        y:p.y * n
    };
};

const dot = (p, q)=>{
    return p.x*q.x + p.y*q.y;
}

const _add = (p, q)=>{
    return PT(p.x + q.x, p.y + q.y);
};

const pMinusQ = (p, q)=>{
    PT(p.x - q.x, p.y - q.y);
};

const pToQ = (p, q)=>{
    return PT(q.x - p.x, q.y - p.y);
};

const perp = v=>{
    return PT(-v.y, v.x);
};

const modSqr = (a)=>{
    return Utils.dot(a, a);
};

const getMultipliersForBasis = (p, v, w)=>{
    // any p can be expressed as: p = Lambda v + Mu w
    const lambda = dot(p, v)/dot(v, v);
    const mu = dot(p, w)/dot(w, w);
    return {lambda, mu};
}

const cross = (p, q)=>{
    // multiple of 'k'
    return p.x*q.y - p.y*q.x;
}

const vectorsIntersect = (p, v, q, w)=>{
    const mu = cross(pMinusQ(p, q), v) / cross(w, v);
    const lambda = cross(pMinusQ(q, p), v) / cross(v, w);
    return !isNaN(mu) && mu >= 0 && mu <= 1 && !isNaN(lambda) && lambda >= 0 && lambda <= 1;
}

const Utils = {
    PT:PT,
    add:add,
    times:times,
    dot:dot,
    pToQ:pToQ,
    perp:perp,
    modSqr:modSqr,
    getMultipliersForBasis:getMultipliersForBasis,
    cross:cross,
    vectorsIntersect:vectorsIntersect
};

export default Utils;
