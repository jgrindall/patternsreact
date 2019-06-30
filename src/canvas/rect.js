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
        for(let lambda = span.lambda.min; lambda <= span.lambda.max; lambda++){
            for(let mu = span.mu.min; mu <= span.mu.max; mu++){
                transforms.push(GeomUtils.getTranslation(lambda*this.v.x + mu*this.w.x, lambda*this.v.y + mu*this.w.y));
            }
        }
        return transforms;
    }
    getSpanXYForRect(r){
        const pts = r.getAll().map(this.getMultipliers.bind(this));
        const lambdas = pts.map(p=>p.lambda);
        const mus = pts.map(p=>p.mu);
        return {
            lambda:{
                min:Math.floor(_.min(lambdas)),
                max:Math.floor(_.max(lambdas))
            },
            mu:{
                min:Math.floor(_.min(mus)),
                max:Math.floor(_.max(mus))
            }
        };
    }
}

export default Rect;
