import GeomUtils from "./canvas/geom_utils";
import Segment from "./Segment";
import Utils from "./canvas/utils";
import Rect from "./canvas/rect";
import _ from "lodash";
import {QuadTree, Box, Point, Circle} from 'js-quadtree';

class Hash{
    constructor(){
        this.quadtree = new QuadTree(new Box(0, 0, 1024, 600));
    }
    empty(){
        this.pointHash = [];
        return this;
    }
    addAll(segments){
        segments.forEach(this.add.bind(this));
        return this;
    }
    add(segment){
        this.pointHash.push({
            location:segment.start,
            type:"start",
            segment:segment
        });
        this.pointHash.push({
            location:segment.end,
            type:"end",
            segment:segment
        });
        //quadtree.insert(new Point(100, 200, {custom: 'data'}));
        //const results = quadtree.query(new Circle(150, 150, 100));
    }
}

export default Hash;
