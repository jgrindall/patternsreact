
import {QuadTree, Box, Point, Circle} from 'js-quadtree';
import _ from "lodash";
import Utils from "./canvas/utils";

class Hash{
    constructor(){
        this.quadtree = new QuadTree(new Box(0, 0, 1000, 480));
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
    getClose(p, index){
        let results = this.quadtree.query(new Circle(p.x, p.y, 20));
        const sameSegment = results.filter(result => {
            return (result.data.custom.segment._index === index);
        });
        if(sameSegment.length >= 1 && sameSegment.length === results.length){
            return Utils.average(results);
        }
        return results.length >= 1 ? results[0] : p;
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
