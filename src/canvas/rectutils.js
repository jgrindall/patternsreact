const RectUtils = {
    rectContainsPoint:(p, q)=>{
        const mult = p.getMultipliers(q);
        return mult.lambda >= 0 && mult.mu >= 0 && mult.lambda <= 1 && mult.mu <= 1;
    },
    // a completely inside b
    rectAIsWithinRectB:(a, b)=>{
        const pts = a.getAll();
        for(i = 0; i < pts.length; i++){
            if(!RectUtils.rectContainsPoint(b, pts[i])){
                return false;
            }
        }
        return true;
    },
    lineIntersectsRect:(p, v, rect)=>{
        return vectorsIntersect(p, v, rect.get('p'), rect.v) ||
        vectorsIntersect(p, v, rect.get('p'), rect.w) ||
        vectorsIntersect(p, v, rect.get('v'), rect.w) ||
        vectorsIntersect(p, v, rect.get('w'), rect.v);
    },
    rectOverlapsRect:(rectA, rectB)=>{
        return RectUtils.rectAIsWithinRectB(rectA, rectB) ||
        RectUtils.rectAIsWithinRectB(rectB, rectA) ||
        RectUtils.lineIntersectsRect(rectA.get('p'), rectA.v, rectB) ||
        RectUtils.lineIntersectsRect(rectA.get('p'), rectA.w, rectB) ||
        RectUtils.lineIntersectsRect(rectA.get('v'), rectA.w, rectB) ||
        RectUtils.lineIntersectsRect(rectA.get('w'), rectA.v, rectB);
    }
}

export default RectUtils;
