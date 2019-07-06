import React, { Component } from 'react';
class MyComponent1 extends Component {

  constructor(props){
    super(props);
    this.state = {
        x: 0,
        y: 0
    };
  }
  componentWillMount(){
    //console.log('First this called');
  }


  componentDidMount(){

  }

  render() {
    return(
        <div>
            MyComp

      </div>
    )
  }
}

export default MyComponent1;
