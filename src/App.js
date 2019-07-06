import React from 'react';
import './App.css';
import MyComponent from './MyComponent';
import Menu from './Menu';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'


function App() {
  return (
    <div className="App">

      <MyComponent></MyComponent>
      <Menu></Menu>


    </div>

  );
}

export default App;
