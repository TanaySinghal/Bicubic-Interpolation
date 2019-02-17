import React, { Component } from 'react';
import { scaleImage } from '../scripts/ScaleImg';
import img from '../assets/man.png';

const SCALE_FACTOR = 10;

class App extends Component {
  componentDidMount() {
    scaleImage(img, SCALE_FACTOR);
  }

  render() {
    return null;
  }
}

export default App;
