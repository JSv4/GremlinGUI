// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export class PortalAwareDragItem extends Component {
    render() {

        const provided = this.props.provided;
        const snapshot = this.props.snapshot;    
        const usePortal = snapshot.isDragging;
    
        const child = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            inPortal={usePortal}
          >
            {this.props.children}
          </div>
        );
    
        if (!usePortal || !this.props.portal) {
          return child;
        }
    
        // if dragging - put the item in a portal
        return ReactDOM.createPortal(child, this.props.portal);
      }
}
