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

class MyComponent extends Component {

  constructor(props){
    super(props);
    this.canvasRef = React.createRef();
    this.drawingRef = React.createRef();
    this.state = {
        mode:"idle",
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
    console.log('First this called');
    renderer.init(this.canvasRef.current);
  }

  _drawLine(p0, p1){
      renderer.drawLine(p0, p1);
  }

  _clearLine(){
      renderer.clearLine();
  }

  _drawSegs(lineSegments = []){


      const baseTransforms = _.map(gp.baseTransforms, t=>{
          return GeomUtils.compose(t, trans);
      })

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
      renderer.update(allSeg);
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
      const newS = this.state.rSegments.concat([seg]);
      this.setState({ mode:"idle", rSegments:newS});
      this._clearLine();
      this._drawSegs(newS);
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
                <canvas ref={this.drawingRef} width='1024' height='600' ></canvas>
                <h1>Mouse coordinates: { start.x } { start.y }   { end.x } { end.y }</h1>
      </div>
    )
  }
}

export default MyComponent;
