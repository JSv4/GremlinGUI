import {
    AbstractDisplacementState,
    Action,
    InputType,
  } from '@projectstorm/react-canvas-core';
  
  export default class SelectLinkState extends AbstractDisplacementState {
    constructor() {
      super({ name: 'select-link' });
  
      this.registerAction(
        new Action({
          type: InputType.MOUSE_DOWN,
          fire: event => {
            const link = this.engine.getMouseElement(event.event);
  
            if (link.isLocked()) {
              this.eject();
            }
  
            this.engine.getModel().clearSelection();
            link.setSelected(true);
          },
        }),
      );
    }

    fireMouseMoved(event) {
      // do nothing
    }
  }