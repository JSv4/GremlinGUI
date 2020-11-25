import {
    State,
    Action,
    InputType,
    SelectingState,
    DragCanvasState,
    MoveItemsState,
  } from '@projectstorm/react-canvas-core';
  import {
    PortModel,
    LinkModel,
    DragNewLinkState
  } from '@projectstorm/react-diagrams-core';
  
  import SelectLinkState from './SelectLinkState';
  
  /**
   * This class defines custom handlers (called states) to respond to
   * clicking events on certain elements.
   */
  export default class CustomState extends State {
    constructor() {
      super({
        name: 'diagram-states',
      });

      this.childStates = [new SelectingState()];
      this.dragCanvas = new DragCanvasState();
      this.dragNewLink = new DragNewLinkState();
      this.dragItems = new MoveItemsState();
  
      // Prevent "loose" links - links where there is there is no end or start node
      this.dragNewLink.config.allowLooseLinks = false;

      // But this is a custom one!
     this.selectLink = new SelectLinkState();
  
      // Determine what was clicked on
      this.registerAction(
        new Action({
          type: InputType.MOUSE_DOWN,
          fire: event => {
            const element = this.engine
              .getActionEventBus()
              .getModelForEvent(event);
  
            // The canvas was clicked on, transition to the dragging canvas state
            if (!element) {
              this.transitionWithEvent(this.dragCanvas, event);
            }
            // Initiate dragging a new link
            else if (element instanceof PortModel) {
              this.transitionWithEvent(this.dragNewLink, event);
            }
            // Link selection <============================================
            else if (element instanceof LinkModel) {
              this.transitionWithEvent(this.selectLink, event);
            }
            // Move items
            else {
              this.transitionWithEvent(this.dragItems, event);
            }
          },
        }),
      );
    }
  }