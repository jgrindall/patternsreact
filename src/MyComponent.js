import React, { Component } from 'react';
import GeomUtils from './canvas/geom_utils';
import groupP3M1 from './canvas/group_p3m1';
import renderer from './canvas/Renderer';
import SegmentData from "./SegmentData";
import TransformData from "./TransformData";
import DrawTool from "./DrawTool";
import TransformTool from "./TransformTool";
import SelectTool from "./SelectTool";

const gp = groupP3M1;

const trans = GeomUtils.compose(
    GeomUtils.getTranslation(0, 0),
    GeomUtils.getScale(1),
    GeomUtils.getRotationAboutOrigin(0.0)
);

class MyComponent extends Component {

  constructor(props){
    super(props);
    this.canvasRef = React.createRef();
    this.transformData = new TransformData(gp, trans);
    this.list1 = new SegmentData(this.transformData);
    this.list1.on("draw", this.draw.bind(this));
    this.list2 = new SegmentData(this.transformData);
    this.list2.on("draw", this.draw.bind(this));
    this._updateTool();
  }

  componentDidUpdate(prevProps, prevState) {
      if(prevProps.tool !== this.props.tool){
          this._updateTool();
      }
  }

  _updateTool(){
      if(this.props.tool === "draw"){
          this._tool = new DrawTool(this.list1);
      }
      else if(this.props.tool === "drawc"){
          this._tool = new DrawTool(this.list2);
      }
      else if(this.props.tool === "select"){
          this._tool = new SelectTool(this.list1);
      }
      else if(this.props.tool === "transform"){
          this._tool = new TransformTool(this.transformData);
      }
  }

  componentDidMount(){
    renderer.init(this.canvasRef.current);
    this.draw();
  }

  draw(){
    renderer.update(
        this.list1.getAllSegments(),
        this.list2.getAllSegments(),
        this.transformData.transformedBaseRect,
        this.transformData.coverTransforms
    );
    this.forceUpdate();
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
      const num0 = this.transformData.baseTransforms.length;
      const num1 = this.transformData.coverTransforms.length;

      const num1_0 = this.list1.baseSegments.length;
      const num1_1 = this.list1.allSegments.length;

      const num2_0 = this.list2.baseSegments.length;
      const num2_1 = this.list2.allSegments.length;

      const s0 = this.transformData.transform.toString();
      const s1 = 'base: ' + num0 + '\ncover: ' + num1 ;
      const s2 = 'baseseg: ' + num1_0 + '\nall: ' + num1_1;
      const s3 = 'baseseg: ' + num2_0 + '\nall: ' + num2_1;
      return(
            <div className='drawing'
                onMouseDown={this._onMouseDown.bind(this)}
                onMouseMove={this._onMouseMove.bind(this)}
                onMouseUp={this._onMouseUp.bind(this)}>

                    <canvas ref={this.canvasRef} width='1000' height='480' ></canvas>

                    <textarea value = {s0 + '\n\n\n' + s1 + '\n\n\n' + s2 + '\n\n\n' + s3}></textarea>

            </div>
        )
    }

}

export default MyComponent;
