import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faArrowsAlt, faPencilAlt, faMousePointer } from '@fortawesome/free-solid-svg-icons'

class MyComponent1 extends Component {

  constructor(props){
    super(props);
    this.state = {
        tool: 'draw'
    };
  }
  componentWillMount(){
    //console.log('First this called');
  }
  onSelectTool(toolName, e){
      this.setState({'tool':toolName});
  }

  componentDidMount(){

  }

  render() {
      const tool = this.state.tool;
    return(
        <div>

        <ButtonGroup className="buttons" vertical>
              <Button onClick={this.onSelectTool.bind(this, "transform")} variant={tool === "transform" ? "success" : "primary"}>
                    <FontAwesomeIcon icon={faArrowsAlt} />
                </Button>
              <Button onClick={this.onSelectTool.bind(this, "select")} variant={tool === "select" ? "success" : "primary"}>
                    <FontAwesomeIcon icon={faMousePointer} />
              </Button>
              <Button onClick={this.onSelectTool.bind(this, "drawc")} variant={tool === "drawc" ? "success" : "primary"}>
                    <FontAwesomeIcon icon={faPencilAlt} />
              </Button>
              <Button onClick={this.onSelectTool.bind(this, "draw")} variant={tool === "draw" ? "success" : "primary"}>
                    <FontAwesomeIcon icon={faPencilAlt} />
              </Button>
        </ButtonGroup>


      </div>
    )
  }
}

export default MyComponent1;
