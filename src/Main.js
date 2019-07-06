import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import './App.css';
import MyComponent from './MyComponent';
import Menu from './Menu';

class Main extends Component {

  constructor(props){
    super(props);
    this.state = {
        tool: 'select'
    };
  }
  onSelectTool(tool){
      this.setState({tool:tool});
  }

  render() {
      const tool = this.state.tool;
      return(
        <div className="App">

          <MyComponent
            tool={tool}>
          </MyComponent>

          <Menu
             tool={tool}
             onSelectTool={name => this.onSelectTool(name)}>
         </Menu>

        </div>
    )
  }
}

export default Main;
