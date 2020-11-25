import * as React from 'react';

import { CustomCanvasWidget } from './Canvas/CustomCanvasWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import './digraph.scss';

//Solution to zoom truncating in this github issue: https://github.com/projectstorm/react-diagrams/issues/666
export class DigraphView extends React.Component {
  
  render() {
    return (
      <CustomCanvasWidget>
        <CanvasWidget className="diagram-container" engine={this.props.digraphEngine.getEngine()} />
      </CustomCanvasWidget>);
	}
}

export default DigraphView;
