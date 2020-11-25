import React, { Component } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/mode-python";
import "ace-builds/src-min-noconflict/theme-solarized_dark";
import 'ace-builds';
import "ace-builds/webpack-resolver";
import { Accordion, Icon, Dimmer, Loader, Segment } from 'semantic-ui-react';

export default class PythonViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hidePython:false,
        };
    }

    render() {

        const style = {
            padding: "10px",
            borderRadius: "3px",
            margin: "10px 0px",
            maxHeight: "200px",
            width: "100%"
        };

        return (
            <Segment style={{...this.props.style}}>
                <Dimmer active={this.props.loading} inverted>
                    <Loader size='tiny' inverted>Loading</Loader>
                </Dimmer>
                <Accordion fluid style={{...this.props.style}}>
                    <Accordion.Title
                        active={this.state.hidePython}
                        onClick={() => this.setState({hidePython: !this.state.hidePython})}
                    >
                        <Icon name='dropdown' />
                        {this.props.title ? this.props.title : "Code"}:
                    </Accordion.Title>
                    <Accordion.Content active={this.state.hidePython}>
                        <AceEditor
                            style={style}
                            mode="python"
                            theme="tomorrow"
                            name="code_editor"
                            readOnly={true}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={this.props.code ? this.props.code : "No code to show..."}
                            setOptions={{
                                showLineNumbers: true,
                                tabSize: 4,
                        }}/>
                    </Accordion.Content>
                </Accordion>
            </Segment>   
        );
    }
}
