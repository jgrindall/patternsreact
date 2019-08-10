import GeomUtils from './geom_utils';
import Utils from './utils';
import _ from 'lodash';

class Rect{
    /*
    Rectangle defined by one point and two perpendicular vectors
    */
    constructor(p, v, w){
        const TOL = 0.00001;
        if(Math.abs(Utils.dot(v, w)) > TOL){
            throw new Error("rect");
        }
        this.p = p;
        this.v = v;
        this.w = w;
        this.q = Utils.add(p, v);
        this.r = Utils.add(p, w);
        this.s = Utils.add(p, v, w);
    }
    /*
    A new Rect offset by lambda * v + mu * w
    */
    getOffset(lambda = 0, mu = 0){
        const offsetP = Utils.add(this.p, Utils.times(this.v, lambda), Utils.times(this.w, mu));
        return new Rect(offsetP, this.v, this.w);
    }
    getTransformed(t){
        const newPPoint = t.apply(this.p)
        const newVPoint = t.apply(this.get('v'))
        const newWPoint = t.apply(this.get('w'))

        return new Rect(newPPoint, Utils.pToQ(newPPoint, newVPoint), Utils.pToQ(newPPoint, newWPoint))
    }
    getPointForMult(l, m){
        return Utils.add(this.p, Utils.times(this.v, l), Utils.times(this.w, m));
    }
    getAll(){
        return [
            this.get('p'),
            this.get('v'),
            this.get('w'),
            this.get('v+w')
        ];
    }
    get(i){
        if(i === 'p'){
            return this.p;
        }
        if(i === 'v'){
            return Utils.add(this.p, this.v);
        }
        if(i === 'w'){
            return Utils.add(this.p, this.w);
        }
        if(i === 'v+w'){
            return Utils.add(this.p, this.v, this.w);
        }
        else{
            throw new Error("undefined pos");
        }
    }
    getMultipliers(q){
        return Utils.getMultipliersForBasis(Utils.pToQ(this.p, q), this.v, this.w);
    }
    getTransformsForRect(r){
        const span = this.getSpanXYForRect(r);
        const transforms = [];
        for(let lambda = span.lambda.min - 1; lambda <= span.lambda.max + 1; lambda++){
            for(let mu = span.mu.min - 1; mu <= span.mu.max + 1; mu++){
                transforms.push(GeomUtils.getTranslation(lambda*this.v.x + mu*this.w.x, lambda*this.v.y + mu*this.w.y));
            }
        }
        return transforms;
    }
    getMappedSeg(seg){
        const p0 = seg[0];
        const p1 = seg[1];
        const p0Top1 = Utils.pToQ(p0, p1);
        const p1Top0 = Utils.pToQ(p1, p0);
        const data0 = this._getMappingData(p0);
        const data1 = this._getMappingData(p1);
        if(data0.lambda === data1.lambda && data0.mu === data1.mu){
            return [
                [
                    data0.p,
                    data1.p
                ]
            ];
        }
        else{
            return [
                //use data0
                [
                    data0.p,
                    Utils.add(data0.p, p0Top1)
                ],
                //use data1
                [
                    Utils.add(data1.p, p1Top0),
                    data1.p
                ]
            ];
        }
    }
    getMappingData(p){
        //map the point P into our rect
        const mult = this.getMultipliers(p);
        let rLambda = Math.floor(mult.lambda);
        let rMu = Math.floor(mult.mu);
        let lambda = mult.lambda - rLambda;
        let mu = mult.mu - rMu;
        return {
            p:this.getPointForMult(lambda, mu),
            lambda:rLambda,
            mu:rMu
        };
    }
    getSpanXYForRect(r){
        const pts = r.getAll().map(this.getMultipliers.bind(this));
        const lambdas = pts.map(p=>p.lambda);
        const mus = pts.map(p=>p.mu);
        return {
            lambda:{
                min:Math.floor(_.min(lambdas)),
                max:Math.ceil(_.max(lambdas))
            },
            mu:{
                min:Math.floor(_.min(mus)),
                max:Math.ceil(_.max(mus))
            }
        };
    }
}

export default Rect;
