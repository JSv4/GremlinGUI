import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { Accordion, Icon, Dimmer, Loader, Segment } from 'semantic-ui-react';

export default class JsonViewer extends Component {

    static defaultProps = {
        theme: "bright:inverted",
        src: null,
        collapsed: true,
        collapseStringsAfter: 15,
        groupArraysAfter: 500,
        onAdd: true,
        onEdit: true,
        onDelete: true,
        displayObjectSize: true,
        enableClipboard: true,
        indentWidth: 4,
        displayDataTypes: true,
        iconStyle: "triangle"
    }

    constructor(props) {
        super(props);
        this.state = {
            hideJson:false,
        };
    }

    render() {

        const {
            collapseStringsAfter,
            groupArraysAfter,
            displayObjectSize,
            enableClipboard,
            theme,
            iconStyle,
            collapsed,
            indentWidth,
            displayDataTypes,
        } = this.props;

        const style = this.props.style ? this.props.style : {
            padding: "10px",
            borderRadius: "3px",
            margin: "10px 0px",
            maxHeight: '30vh', 
        };

        return (
            <Segment style={{...this.props.style}}>
                <Dimmer active={this.props.loading} inverted>
                    <Loader size='tiny' inverted>Loading</Loader>
                </Dimmer>
                <Accordion fluid style={{...this.props.style}}>
                    <Accordion.Title
                        active={this.state.hideJson}
                        onClick={() => this.setState({hideJson: !this.state.hideJson})}
                    >
                        <Icon name='dropdown' />
                        {this.props.title ? this.props.title : "Data"}:
                    </Accordion.Title>
                    <Accordion.Content active={this.state.hideJson} style={{overflowY:'scroll'}}>
                        <ReactJson 
                            collapsed={collapsed}
                            style={{...style, fontSize: 9}}
                            theme={theme}
                            src={this.props.jsonObj}
                            collapseStringsAfterLength={collapseStringsAfter}
                            groupArraysAfterLength={groupArraysAfter}
                            displayObjectSize={displayObjectSize}
                            enableClipboard={enableClipboard}
                            indentWidth={indentWidth}
                            displayDataTypes={displayDataTypes}
                            iconStyle={iconStyle}
                        />
                    </Accordion.Content>
                </Accordion>
            </Segment>   
        );
    }
}
