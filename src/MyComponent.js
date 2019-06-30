import React, { Component } from 'react';
import Drawer from "./canvas/main";

class MyComponent extends Component {

  constructor(props){
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      data: 'Jordan Belfort'
    }
  }
  componentWillMount(){
    console.log('First this called');
  }

  getData(){
    setTimeout(() => {
      console.log('Our data is fetched');
      this.setState({
        data: 'Hello WallStreet'
      })
    }, 1000)
  }

  componentDidMount(){
    this.getData();
    this.drawer = Drawer;
    this.drawer.init(this.canvasRef.current);
    this.drawer.update();
  }

  _onMouseMove(){
      this.drawer.update();
  }

  render() {
    return(
      <canvas ref={this.canvasRef} width='1024' height='600' onMouseMove={this._onMouseMove.bind(this)}>

      </canvas>
    )
  }
}

export default MyComponent;
