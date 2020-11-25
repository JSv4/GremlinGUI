import * as React from 'react';
import { Icon, Sidebar, Segment, Label, Loader, Dimmer } from 'semantic-ui-react';
import DigraphView from '../DigraphToo/DigraphView';


const showStyle= {
    width: '100%',
    height: '86vh',
    marginBottom:'0px',
    marginLeft:'260px',
    transition: 'all 500ms ease',
}

const hideStyle={
    width: '100%',
    height: '86vh',
    marginLeft:'0px',
    marginBottom:'0px',
    transition: 'all 500ms ease',
}

const goBackShowStyle={
    position:'absolute',
    left:'260px',
    top:'0px',
    transition: 'all 500ms ease',
};

const goBackHideStyle={
    position:'absolute',
    left:'0px',
    top:'0px',
    transition: 'all 500ms ease',
};

const controlsShowStyle = {
    position: 'absolute',
    top: '5vh',
    left:'300px',
    zIndex: 10,
    transition: 'all 500ms ease',
};

const controlsHideStyle = {
    position: 'absolute',
    top: '5vh',
    left:'40px',
    zIndex: 10,
    transition: 'all 500ms ease',
};

const trayControlsHiddenStyle = {
    cursor:'pointer',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    zIndex: 1000,
    position: 'absolute',
    bottom: '40vh',
    right:'0px',
    borderRadius:'5px 0px 0px 10px',
    backgroundColor:'#f3f4f5',
    transition: 'all 500ms ease',
};

const trayControlsShownStyle = {
    cursor:'pointer',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    zIndex: 1000,
    position: 'absolute',
    bottom: '40vh',
    right:'15px',
    borderRadius:'5px 0px 0px 10px',
    backgroundColor:'#f3f4f5',
    transition: 'all 500ms ease',
}

const collapseButtonHiddenStyle = {
    cursor:'pointer',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    zIndex: 1000,
    position: 'absolute',
    bottom: '75vh',
    right:'0px',
    borderRadius:'5px 0px 0px 10px',
    width:'5vw',
    height:'7vh',
    backgroundColor:'#f3f4f5',
    transition: 'all 500ms ease',
};

const collapseButtonShownStyle = {
    cursor:'pointer',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    zIndex: 1000,
    position: 'absolute',
    bottom: '75vh',
    right:'15px',
    borderRadius:'5px 0px 0px 10px',
    width:'5vw',
    height:'7vh',
    backgroundColor:'#f3f4f5',
    transition: 'all 500ms ease',
}

const playControlsStyle = {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    width:'100%',
    bottom: '5vh'
}

const headerWidgetStyle = {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    width:'100%',
    top: '5vh'
}

export class Digraph extends React.PureComponent {
    

     // Zoom out of the digraph (the way that component is written, the zoom level is embedded)
    // in the digraph json which is stored in state, soooo... just change state scale property
    zoomOut = () => {
        console.log("Reqire zoom out");
    }

     // Reset zoom of the digraph (the way that component is written, the zoom level is embedded)
    // in the digraph json which is stored in state, soooo... just change state scale property
    resetZoom = () => {
        console.log("Reset zoom");
    }

    render() {

        // Pass methods and properties to detailPanel component passed in
        // 1) selectedNode, which is the currently selected node and all related data in the digraph json
        // 2) selectedNodeDetails - if you pass array of detail items with ids matching the nodes in the digraph,
        //    selected node will have its corresponding detail object loaded. 
        // 3) moveXandYTo - a method to move the digraph view pane to center on a given x,y coord
        let detailPanel = React.cloneElement(this.props.detailPanel, {
            props:'add things here if needed'
        });

        // Inject navigation methods into the user's controls for use by the component
        let controls = React.cloneElement(this.props.controls, {
            zoomIn: this.zoomIn,
            zoomOut: this.zoomOut,
            resetZoom: this.resetZoom,
            moveXandYTo: this.moveXandYTo
        });

        return (
            <Sidebar.Pushable 
                as={Segment} 
                style={{
                    width:'100%',
                    height:'87vh',
                    margin:'0px'
                }}>
                <Sidebar
                    animation='push'
                    direction='right'
                    visible={this.props.showSidebar}
                    style={{width:'275px', padding:'0px'}}
                >
                    {detailPanel}
                </Sidebar>
                <Sidebar.Pusher style={{padding:'0px'}}>  
                    { this.props.loadingText ? 
                        <Dimmer active inverted>
                            <Loader inverted>{this.props.loadingText}</Loader>
                            {/*Need back button visible over the loader dimmer and this 
                            was only way I could figure out to do that, even though it's
                            duplicative of loader elsewhere */}
                            <Label
                                    style={ this.props.showSidebar ? goBackShowStyle : goBackHideStyle } 
                                    corner='left'
                                    color='blue'
                                    icon='reply'
                                    onClick={() => this.props.exitDigraph()}
                                />
                        </Dimmer> : <></> 
                    }
                    <div style={{width:'100%', height:'100%'}}>
                        {
                            this.props.showSidebarToggle ? 
                            <div 
                                onClick={() => this.props.toggleSidebar()}
                                style={this.props.showSidebar ? collapseButtonShownStyle : collapseButtonHiddenStyle}>
                                <div> 
                                    <Icon 
                                        name={ this.props.showSidebar ? 
                                                'arrow alternate circle right outline' :
                                                'arrow alternate circle left outline'
                                        }
                                        color={ this.props.showSidebar ? 'red' : 'green'}
                                        size='big'
                                    />
                                </div>
                            </div> : <></>
                        }
                        <div 
                            style={ this.props.showSidebar ? showStyle : hideStyle }
                            onClick={this.props.onCanvasClick}
                        >
                            <Label
                                style={ this.props.showSidebar ? goBackShowStyle : goBackHideStyle } 
                                corner='left'
                                color='blue'
                                icon='reply'
                                onClick={() => this.props.exitDigraph()}
                            />
                            <DigraphView digraphEngine={this.props.digraphEngine}/>
                            { controls ? 
                                <div style={ this.props.showSidebar ? controlsShowStyle : controlsHideStyle}>
                                    {controls}
                                </div> : <></> }
                            { this.props.trayControls ? 
                                <div style={ this.props.showSidebar ? trayControlsShownStyle : trayControlsHiddenStyle}>
                                    {this.props.trayControls}
                            </div> : <></> }
                            { this.props.playControls ? 
                                <div style={playControlsStyle}>
                                    {this.props.playControls}
                                </div> : <></> }
                            { this.props.headerWidget ? 
                            <div style={headerWidgetStyle}>
                                {this.props.headerWidget}
                            </div> : <></> }
                        </div>                      
                    </div>
                </Sidebar.Pusher>   
            </Sidebar.Pushable>
        );
    }
}
