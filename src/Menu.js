import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAlt, faPencilAlt, faMousePointer } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash"

class MyComponent1 extends Component {

  componentWillMount(){
    //console.log('First this called');
  }
  onSelectTool(toolName, e){
      //this.setState({'tool':toolName});
  }

  componentDidMount(){

  }

  render() {
      const tool = this.props.tool;
      return(
        <div>

            <ButtonGroup className="buttons" vertical>

                  <Button
                        onClick={_.partial(this.props.onSelectTool, "transform")}
                        variant={tool === "transform" ? "success" : "primary"}>
                            <FontAwesomeIcon icon={faArrowsAlt} />
                    </Button>

                  <Button
                        onClick={_.partial(this.props.onSelectTool, "select")}
                        variant={tool === "select" ? "success" : "primary"}>
                            <FontAwesomeIcon icon={faMousePointer} />
                  </Button>

                  <Button
                        onClick={_.partial(this.props.onSelectTool, "drawc")}
                        variant={tool === "drawc" ? "success" : "primary"}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                  </Button>

                  <Button
                        onClick={_.partial(this.props.onSelectTool, "draw")}
                        variant={tool === "draw" ? "success" : "primary"}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                  </Button>

            </ButtonGroup>

      </div>
    )
  }
}

export default MyComponent1;
