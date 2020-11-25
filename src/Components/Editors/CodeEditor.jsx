import * as React from 'react';
import { Segment, Button, Header, Icon, Label, Popup } from 'semantic-ui-react';
import AceEditor from 'react-ace';

import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/mode-python';
import 'ace-builds/src-min-noconflict/theme-solarized_dark';
import 'ace-builds';
import 'ace-builds/webpack-resolver';

import ConfirmModal from '../Shared/ConfirmModal';

const ConfirmChange = (props) => (
    <ConfirmModal
        visible={props.visible}
        message='YOu have chosen to save the changes you made to this JSON object. ARE YOU SURE?'
        yesAction={() => props.onConfirm()}
        noAction={props.toggleModal}
        toggleModal={props.toggleModal}
    />
);

export class CodeEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            code: props.code,
            collapsed: true,
            showSaveConfirm: false,
        };
    }

    toggleConfirmModal = () => {
        this.setState({
            showSaveConfirm: !this.state.showSaveConfirm,
        });
    };

    updateCode = () => {
        this.props.onSave(this.state.code);
        this.toggleConfirmModal();
    };

    onCodeChange = (code) => {
        console.log("Code change:", code);
        this.setState({
            code,
        });
    };

    render() {
        const style = {
            padding: '10px',
            borderRadius: '3px',
            margin: '10px 0px',
            maxHeight: '200px',
            width: '100%',
        };

        const { additionalActions } = this.props;

        return (
            <>
                <ConfirmChange
                    visible={this.state.showSaveConfirm}
                    toggleModal={this.toggleConfirmModal}
                    onConfirm={this.updateCode}
                />
                <div style={{ textAlign: 'center' }}>
                    <div>
                        <Header as='h4'>
                            <Icon name='code' />
                            <Header.Content>
                                Input Data Transform Script
                                <Header.Subheader as='h6'>
                                    Python Code to Apply to Input JSON
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </div>
                <Segment style={{ width: '350px', paddingTop:'20px'}}>
                    <Popup
                        content={this.props.toolTip}
                        on='hover'
                        trigger={
                            <Label attached='top'>
                                {this.props.title ? this.props.title : "Script:"}
                            </Label>
                        }
                    />
                    <AceEditor
                        style={style}
                        mode='python'
                        theme='tomorrow'
                        name='code_editor'
                        onChange={this.onCodeChange}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={this.state.code}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 4,
                        }}
                    />
                </Segment>
                <div style={{ textAlign: 'right' }}>
                    <Button 
                        primary
                        onClick={() => this.toggleConfirmModal()}
                        size='mini'
                    >
                        Save
                    </Button>
                    {additionalActions ? additionalActions : <></>}
                </div>
            </>
        );
    }
}
