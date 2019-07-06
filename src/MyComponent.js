import React, { Component } from 'react';
//import Drawer from "./canvas/main";
import GeomUtils from './canvas/geom_utils';
import Utils from './canvas/utils';
import groupP3M1 from './canvas/group_p3m1';
import Rect from './canvas/rect';
import renderer from './canvas/renderer';
import _ from "lodash";

const gp = groupP3M1;

const trans = GeomUtils.compose(
    GeomUtils.getTranslation(150, 50),
    GeomUtils.getScale(1.3),
    GeomUtils.getRotationAboutOrigin(0.3)
);

const invTrans = GeomUtils.getInverse(trans);

class MyComponent extends Component {

  constructor(props){
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
        mode:"idle",
        focus:"cons",
        start:{
            x:0,
            y:0
        },
        end:{
            x:0,
            y:0
        },
        cSegments:[],
        rSegments:[]
    };
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
              allSeg.push(GeomUtils.transformSegment(lineSegments[j], allT[i]))
          }
      }
      return allSeg;
  }

  _drawSegs(lineSegments = []){
      const segs = this._getAllSegs(lineSegments);
      renderer.update(segs, this.state.focus);
  }

  _onMouseDown(e){
      const p = {x: e.pageX, y: e.pageY};
      this.setState({ mode:"draw", start:p, end:p});
  }

  _onMouseMove(e){

      //console.log(this.state);
      if(this.state.mode === "draw"){
          const p = {x: e.pageX, y: e.pageY};
          this.setState({ end:p});
          this._drawLine(this.state.start, this.state.end);
      }
  }

  _onMouseUp(e){
      const p = {x: e.pageX, y: e.pageY};
      const seg = [this.state.start, p];
      const tSeg = GeomUtils.transformSegment(seg, invTrans);
      let newS;
      if(this.state.focus === "cons"){
          newS = this.state.cSegments.concat([tSeg]);
          this.setState({ mode:"idle", cSegments:newS});
      }
      else{
          newS = this.state.rSegments.concat([tSeg]);
          this.setState({ mode:"idle", rSegments:newS});
      }
      this._clearLine();
      this._drawSegs(newS);
  }
  selectCons(e){
      e.stopPropagation();
      this.setState({focus:"cons"});
  }
  selectReal(e){
       e.stopPropagation();
        this.setState({focus:"real"});
  }

  render() {
      const start = this.state.start;
      const end = this.state.end;
    return(
        <div className='drawing'
            onMouseDown={this._onMouseDown.bind(this)}
            onMouseMove={this._onMouseMove.bind(this)}
            onMouseUp={this._onMouseUp.bind(this)}>

                <canvas ref={this.canvasRef} width='1024' height='600' ></canvas>
                <h1>Mouse coordinates: { start.x } { start.y }   { end.x } { end.y }</h1>
                <button className="cons" onClick={this.selectCons.bind(this)}>cons</button>
                <button className="real" onClick={this.selectReal.bind(this)}>real</button>
      </div>
    )
  }
}

export default MyComponent;
