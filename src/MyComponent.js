import React, { Component } from 'react';
import GeomUtils from './canvas/geom_utils';
import Utils from './canvas/utils';
import groupP3M1 from './canvas/group_p3m1';
import Rect from './canvas/rect';
import renderer from './canvas/renderer';
import _ from "lodash";

const gp = groupP3M1;

const trans = GeomUtils.compose(
    GeomUtils.getTranslation(150, 50),
    GeomUtils.getScale(2.3),
    GeomUtils.getRotationAboutOrigin(0.3)
);

const invTrans = GeomUtils.getInverse(trans);

class DrawingTool{
    constructor(comp){
        this.comp = comp;
        this.state = "idle";
    }
    addSegment(p){
        this.segment = [{x:p.x, y:p.y}, {x:p.x, y:p.y}];
        const segments = this.comp.state.rSegments.concat([this.segment]);
        this.comp.setState({ rSegments:segments});
    }
    onMouseDown(e){
        let data = this.comp.getMatchedData({x: e.pageX, y: e.pageY}, this.comp.state.allRSegments);
        this.state = "drawing";
        this.addSegment(data.p);
    }
    onMouseMove(e){
        if(this.state === "drawing"){
            const p = {x: e.pageX, y: e.pageY};
            this.segment[1].x = p.x;
            this.segment[1].y = p.y;
            this.comp._drawLine(this.segment[0], this.segment[1]);
            const segments = this.comp._getAllSegs(this.comp.state.rSegments);
            this.comp.setState({allRSegments:segments});
            this.comp._drawSegs(segments);
        }
    }
    onMouseUp(e){
        if(this.state === "drawing"){
            this.comp._clearLine();
            this.state = "idle";
        }
    }
};

/*

mode:"idle",
start:{
    x:0,
    y:0
},
end:{
    x:0,
    y:0
},
*/

class ConsDrawingTool{
    constructor(){

    }
    onMouseDown(e){}
    onMouseMove(e){}
    onMouseUp(e){}
};

class TransformingTool{
    constructor(){

    }
    onMouseDown(e){}
    onMouseMove(e){}
    onMouseUp(e){}
};

class SelectingTool{
    constructor(comp){
            this.comp = comp;
    }
    onMouseDown(e){
        let mData = this.comp.getMatchedData({x: e.pageX, y: e.pageY}, this.comp.state.allRSegments);
        if(mData.matched){
            const matchedSegment = mData.segment.baseSegment;
            const index = mData.index;
            this._point = matchedSegment[mData.index];
        }
    }
    onMouseMove(e){
        if(this._point){
            this._point.x += 1;
            let s = this.comp.state.rSegments;
            const allS = this.comp._getAllSegs(s);
            this.comp.setState({ rSegments:s, allRSegments:allS});
            this.comp._drawSegs(allS);
        }
    }
    onMouseUp(e){

    }
};

class MyComponent extends Component {

  constructor(props){
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
        toolState:{

        },
        cSegments:[],
        rSegments:[],
        allCSegments:[],
        allRSegments:[]
    };
  }

  componentDidUpdate(prevProps, prevState) {
      if(prevProps.tool !== this.props.tool){
          this._updateTool();
      }
  }

  _updateTool(){
      if(this.props.tool === "draw"){
          this._tool = new DrawingTool(this);
      }
      else if(this.props.tool === "drawc"){
          this._tool = new ConsDrawingTool(this);
      }
      else if(this.props.tool === "select"){
          this._tool = new SelectingTool(this);
      }
      else if(this.props.tool === "transform"){
          this._tool = new TransformingTool(this);
      }
  }

  componentDidMount(){
    renderer.init(this.canvasRef.current);
  }

  _drawLine(p0, p1){
      renderer.drawLine(p0, p1);
  }

  _clearLine(){
      renderer.clearLine();
  }

  _getAllSegs(lineSegments){
      const baseTransforms = _.map(gp.baseTransforms, t=>{
          return GeomUtils.compose(t, trans);
      });
      const tRect = gp.baseRect.getTransformed(trans);
      const bounds = new Rect(Utils.PT(), Utils.PT(1024, 0), Utils.PT(0, 600))
      const coverTransforms = tRect.getTransformsForRect(bounds)
      const allT = [];
      const allSeg = [];
      _.each(coverTransforms, coverT=>{
          _.each(baseTransforms, (baseTransform)=>{
              allT.push(GeomUtils.compose(baseTransform, coverT));
          });
      });
      for(let i = 0; i < allT.length; i++){
          for(let j = 0; j < lineSegments.length; j++){
              const seg = GeomUtils.transformSegment(lineSegments[j], allT[i]);
              seg.baseSegment = lineSegments[j];
              allSeg.push(seg);
          }
      }
      return allSeg;
  }

  _drawSegs(segs = []){
      console.log(segs);
      //const segs = this._getAllSegs(lineSegments);
      renderer.update(segs, this.props.tool);
  }

  getMatchedData(p, segs){
      return GeomUtils.getPt(segs, p);
  }

  _onMouseDown(e){
      if(this._tool){
          this._tool.onMouseDown(e);
    }
  }

  _onMouseMove(e){
      if(this._tool){
            this._tool.onMouseMove(e);
        }
  }

  _onMouseUp(e){
      if(this._tool){
            this._tool.onMouseUp(e);
    }

  }


  render() {

      return(
            <div className='drawing'
                onMouseDown={this._onMouseDown.bind(this)}
                onMouseMove={this._onMouseMove.bind(this)}
                onMouseUp={this._onMouseUp.bind(this)}>

                    <canvas ref={this.canvasRef} width='1024' height='600' ></canvas>

            </div>
        )
    }

}


export default MyComponent;
