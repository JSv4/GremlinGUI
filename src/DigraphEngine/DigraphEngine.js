import createEngine, {
  DiagramModel,
} from '@projectstorm/react-diagrams';

import CustomState from '../Components/DigraphToo/State/CustomState';
import { JSCustomNodeFactory } from '../Components/DigraphToo/Nodes/Script/JSCustomNodeFactory';
import { JSCustomNodeModel } from '../Components/DigraphToo/Nodes/Script/JSCustomNodeModel';
import GremlinLinkFactory from '../Components/DigraphToo/Links/GremlinLinkFactory';
import GremlinLinkModel from '../Components/DigraphToo/Links/GremlinLinkModel';
import GremlinDeleteItemsAction from '../Components/DigraphToo/Actions/GremlinDeleteItemsAction';

export default class DigraphEngine {
  constructor(store, components=[]) 
  {
    this.components = components;
    this.locked = false;
    this.store = store;

    // Store listeners / callbacks for key user actions on the digram. Nodes are added via a separate menu
    // that isn't part of this component. As long as the action to refresh the node also refreshes  
    this.handleNodeMove = null;
    this.handleNodeSelect = null;
    this.handleNodeUnselected = null;
    this.handleNodeDelete = null;
    this.handleLinkCreate = null;
    this.handleLinkUpdate = null;
    this.handleLinkDelete = null;

    this.initializeEngine();
    this.initializeModel();
  }

  registerNodeMoveListener = (listener) => {
    this.handleNodeMove = listener;
  }

  registerNodeSelectedListener = (listener) => {
    this.handleNodeSelect = listener;
  }

  registerNodeUnselectedListener = (listener) => {
    this.handleNodeUnselected = listener;
  }

  registerNodeDeleteListener = (listener) => {
    this.handleNodeDelete = listener;
  }

  registerLinkCreateListener = (listener) => {
    this.handleLinkCreate = listener;
  }

  registerLinkUpdateListener = (listener) => {
    this.handleLinkUpdate = listener;
  }

  registerLinkDeleteListener = (listener) => {
    this.handleLinkDelete = listener;
  }

  renderPipeline = (selectedPipelineObj) => {
    
    // Blow out whatever model is displayed / rendered
    this.clearAllValues();

    let nodes = [];
    let links = [];

    if (selectedPipelineObj) {
      nodes = selectedPipelineObj.nodes || [];
      links = selectedPipelineObj.edges || [];
    }
    else if (this.store) {
      let state = this.store.getState();
      nodes = state.pipelinesteps.items || [];
      links = state.edges.items || [];
    }

    if (nodes.length > 0) {
      nodes.forEach(node => {
        try{
          this.handleCreateNode(node.id, node.name, node.x_coord, node.y_coord);
        }
        catch(err) {
          console.log("Error creating node: ", err);
        }
         
        }); 
    }

    if (links.length > 0) {
      links.forEach(link => {
        try {
          this.handleCreateLink(link.id, link.start_node, link.end_node);
        }
        catch(err) {
          console.log("Error creating links: ", err);
        }
      });
    }

    this.engine.repaintCanvas();

  }

  getEngine = () => this.engine;

  getModel = () => this.engine.getModel();

  /**
   * Initialization methods
   */
  initializeEngine = () => {

    this.engine = createEngine({
      registerDefaultDeleteItemsAction: false,
      registerDefaultZoomCanvasAction: true
    });

    // React-diagrams is awesome, however the documentation is subpar. If you want to have it so that clicking a link will 
    // select the link, you need to create a custom state (really an event handler)

    // The custom state is not enough, however. Based on testing, you still create nodes in the links on click. If you want to 
    // have click select the link (as opposed to CTRL+click) without creating a node in the link, you also need to select
    // specify a max # of nodes per link per this thread: https://github.com/projectstorm/react-diagrams/issues/49
    this.engine.maxNumberPointsPerLink = 0;

    // Register custom nodes and custom links. In the nodes, we want a custom widget and custom model to hold Gremlin IDs
    // In the links, we just need a custom field to map the react-diagram id to the gremlin id.
    this.engine.getNodeFactories().registerFactory(new JSCustomNodeFactory());
    this.engine.getLinkFactories().registerFactory(new GremlinLinkFactory());
    this.engine.getStateMachine().pushState(new CustomState());
    this.engine.getActionEventBus().registerAction(new GremlinDeleteItemsAction({ keyCodes: [46] }, this.nodeDelete, this.linkDelete));

  };

  initializeModel = () => {
    this.model = new DiagramModel();

    this.model.setGridSize(15);
    this.model.setLocked(false);
    this.model.registerListener({
      eventDidFire: event => {
        const type = event.function;
        if (type === 'offsetUpdated') this.adjustGridOffset(event);
        if (type === 'zoomUpdated') this.adjustGridZoom(event);
        if (type === 'linksUpdated') this.handleLinksChanged(event);
      },
    });
    this.realignGrid();

    this.engine.setModel(this.model);
  };

  /**
   * Diagram locking methods
   */
  setLocked = locked => {
    this.model.setLocked(locked);
    this.locked = locked;
  };

  isLocked = () => this.locked;

  /**
   * Listeners - Really only for link creation / edit and node selection. Node deletion is handled using custom Action
   * in response to user delete command. Nodes are created separately in Gremlin which is then loaded into the engine 
   * in the background. 
   */

  // When a link is created from interaction with the digraph, append a new listener that will create it 
  // in the DB when it's connected to a targetPort. No supporting source node changes. 
  handleLinksChanged = (event) => {
    if (event.isCreated){

      // Only create properly formed links... if they don't connect two nodes, we're going to leave them 
      // out of the DB. Also should add some kind of feature to UI to make it obvious this is how this
      // is handled.
      event.link.registerListener({
        eventDidFire: event => {
          const type = event.function;
          if (type === 'targetPortChanged') this.linkCreate(event);
        },
      });
    }
  }
    
  linkTargetChanged = (event) => {
    this.handleLinkUpdate ? this.handleLinkUpdate(event) : console.log("No link update method provided.");
  }

  handleNodeSelectionChange = (event) => {
    if (event.isSelected) {
      this.handleNodeSelect ? this.handleNodeSelect(event.entity.id) : console.log("No node selection method provided");
    }
    else {
      this.handleNodeUnselected ? this.handleNodeUnselected(event.entity.id) : console.log("No node unselect method provided");
    }
  }

  handleNodeMoved = (event) => {
    this.handleNodeMove ? this.handleNodeMove(event.entity) : console.log("No node move method provided");
  }

  linkCreate = (event) => {
    this.handleLinkCreate ? this.handleLinkCreate(event) : console.log("No link create method provided");
  }

  linkDelete = (linkId) => {
    console.log("Delete link: ", linkId);
    this.handleLinkDelete ? this.handleLinkDelete(linkId) : console.log("No link delete method provided");
  }

  linkInjectGremlinId = (reactDiagramId, gremlinId) => {
    const link = this.getLinkFromReactDiagramId(reactDiagramId);
    link.id = gremlinId;
  }

  nodeDelete = (nodeId) => {
    this.handleNodeDelete ? this.handleNodeDelete(nodeId) : console.log("No node delete method provided");
  }

  /**
   * Diagram painting methods
   */
  repaint = () => this.engine.repaintCanvas();

  realignGrid = () => {
    this.adjustGridOffset({
      offsetX: this.model.getOffsetX(),
      offsetY: this.model.getOffsetY(),
    });

    this.adjustGridZoom({
      zoom: this.model.getZoomLevel(),
    });
  };

  adjustGridOffset = ({ offsetX, offsetY }) => {
    document.body.style.setProperty('--offset-x', `${offsetX}px`);
    document.body.style.setProperty('--offset-y', `${offsetY}px`);
  };

  adjustGridZoom = ({ zoom }) => {
    const { gridSize } = this.model.getOptions();
    document.body.style.setProperty(
      '--grid-size',
      `${(gridSize * zoom) / 100}px`,
    );
  };

  /**
   * Fetch react-diagram objects (links and nodes) based on their gremlin ids (since they won't be the same)
   */
  getNodeFromGremlinId = (id) => {
    const node = this.getEngine()
      .getModel()
      .getNodes()
      .find(node => node.id === id);
    return node;
  }

  getLinkFromGremlinId = (id) => {
    const link = this.getEngine()
      .getModel()
      .getLinks()
      .find(link => link.id === id);
    return link;
  }

  getLinkFromReactDiagramId = (reactDiagramId) => {
    const link = this.getEngine()
      .getModel()
      .getLinks()
      .find(link => link.options.id === reactDiagramId);
    return link
  }



  /**
   * Component creation and configuration methods
   */
  handleCreateLink = (id=-1, start_node=-1, end_node=-1) => {
    
    const link = new GremlinLinkModel(id);

    const sourceNode = this.getNodeFromGremlinId(start_node);
    const targetNode = this.getNodeFromGremlinId(end_node);
    
    link.setSourcePort(sourceNode.getPort('out'));
    link.setTargetPort(targetNode.getPort('in'));
    
    this.getEngine().getModel().addLink(link);    
  }

  addLink = (id, start_node, end_node) => {
    this.handleCreateLink(id, start_node, end_node);
    this.engine.repaintCanvas();
  }

  handleCreateNode = (id, name, x, y, options={}) => {
  
    // Create node
    const node = new JSCustomNodeModel(id, name, options);

    // Set x and y (if applicable, otherwise set at center of screen)
    node.setPosition(x || window.innerWidth / 2, y || window.innerHeight / 2);

    // Register default listener so if the user a) moves, or b) deletes the node, we can take actions in other parts of the application 
    node.registerListener({
      eventDidFire: event => {
        const type = event.function;
        if (type==='positionChanged') this.handleNodeMoved(event);
        if (type==='selectionChanged') this.handleNodeSelectionChange(event);
      }
    });

    this.model.addNode(node);
  };

  addNode = (id, name, options={}) => {
    this.handleCreateNode(id, name, options);
    this.engine.repaintCanvas();
  }

  handleDeleteNode = (gremlin_id) => {
    this.getNodeFromGremlinId(gremlin_id).remove();
    this.engine.repaintCanvas();
  }

  handleDeleteLink = (gremlin_id) => {
    this.getLinkFromGremlinId(gremlin_id).remove();
    this.engine.repaintCanvas();
  }

  zoomIn = () => {
    this.getModel().setZoomLevel(this.getModel().getZoomLevel()+5);
    this.engine.repaintCanvas();
  }

  zoomOut = () => {
    this.getModel().setZoomLevel(this.getModel().getZoomLevel()-5);
    this.engine.repaintCanvas();
  }
  
  zoomToFit = () => {
    this.engine.zoomToFit();
  };

  clearAllValues = () => {
    this.clearLinks();
    this.clearNodes();
    this.repaint();
  };

  clearLinks = () =>
    this.getEngine()
      .getModel()
      .getLinks()
      .forEach(link => link.remove());

  clearNodes = () =>
    this.getEngine()
      .getModel()
      .getNodes()
      .forEach(node => node.remove());

  fireAction = event =>
    this.engine.getActionEventBus().fireAction({
      event: {
        ...event,
        key: '',
        preventDefault: () => {},
        stopPropagation: () => {},
      },
    });
  }