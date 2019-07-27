
import {QuadTree, Box, Point, Circle} from 'js-quadtree';

class Hash{
    constructor(){
        this.quadtree = new QuadTree(new Box(0, 0, 1024, 600));
    }
    empty(){
        this.pointHash = [];
        this.quadtree.clear();
        return this;
    }
    generate(segments){
        this.empty();
        segments.forEach(this.add.bind(this));
        return this;
    }
    getClose(p){
        const results = this.quadtree.query(new Circle(p.x, p.y, 20));
        console.log('res', results);
        return null;
        /*
        const results = quadtree.query(new Circle(150, 150, 100));
        let close = [];
        for(let i = 0; i < this.pointHash.length; i++){
            const entry = this.pointHash[i];
            const eq = (entry.location.x === p.x && entry.location.y === p.y);
            const d = Utils.getDistSqr(entry.location, p);
            if(!eq && d > 0.0000001 && d < 50){
                close.push({entry:entry, d:d});
            }
        }
        if(close.length >= 1){
            close = _.sortBy(close, obj=>obj.d);
            return close[0].entry;
        }
        return null;
        */
    }
    add(segment){
        const start = {
            location:segment.start,
            type:"start",
            segment:segment
        };
        const end = {
            location:segment.end,
            type:"end",
            segment:segment
        };
        this.pointHash.push(start);
        this.pointHash.push(end);
        this.quadtree.insert(new Point(start.location.x, start.location.y, {custom: start}));
        this.quadtree.insert(new Point(end.location.x, end.location.y, {custom: end}));
    }
}

export default Hash;
