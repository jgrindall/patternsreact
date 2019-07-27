import React, { Component } from 'react';
import GeomUtils from './canvas/geom_utils';
import Utils from './canvas/utils';
import groupP3M1 from './canvas/group_p3m1';
import Rect from './canvas/rect';
import renderer from './canvas/renderer';
import _ from "lodash";
import SegmentData from "./SegmentData";
import DrawTool from "./DrawTool";
import TransformTool from "./TransformTool";
import SelectTool from "./SelectTool";
import CDrawTool from "./CDrawTool";

const gp = groupP3M1;

const trans = GeomUtils.compose(
    GeomUtils.getTranslation(50,0),
    GeomUtils.getScale(1.5),
    GeomUtils.getRotationAboutOrigin(0.24)
);

class MyComponent extends Component {

  constructor(props){
    super(props);
    this.trans = trans;
    this.canvasRef = React.createRef();
    this.list = new SegmentData(gp, this.trans);
    this.list.on("draw", this.draw.bind(this));
    this._updateTool();
  }

  componentDidUpdate(prevProps, prevState) {
      if(prevProps.tool !== this.props.tool){
          this._updateTool();
      }
  }

  _updateTool(){
      if(this.props.tool === "draw"){
          this._tool = new DrawTool(this);
      }
      else if(this.props.tool === "drawc"){
          this._tool = new CDrawTool(this);
      }
      else if(this.props.tool === "select"){
          this._tool = new SelectTool(this);
      }
      else if(this.props.tool === "transform"){
          this._tool = new TransformTool(this);
      }
  }

  componentDidMount(){
    renderer.init(this.canvasRef.current);
  }

  draw(){
    renderer.update(this.list.getAllSegments(), this.list.hash, this.props.tool);
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
