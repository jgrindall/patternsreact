import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import './App.css';
import MyComponent from './MyComponent';
import Menu from './Menu';

class Main extends Component {

  constructor(props){
    super(props);
    this.state = {
        tool: 'draw'
    };
  }
  onSelectTool(name){
      console.log(arguments)
      console.log(name)
      this.setState({tool:name});
  }

  render() {
      const tool = this.state.tool;
      return(
        <div className="App">
          <MyComponent></MyComponent>
          <Menu
             tool={tool}
             onSelectTool={name => this.onSelectTool(name)}>
         </Menu>

        </div>
    )
  }
}

export default Main;
