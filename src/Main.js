import React, { Component } from 'react';
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
