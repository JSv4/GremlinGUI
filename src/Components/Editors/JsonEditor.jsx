import * as React from 'react';
import ReactJson from 'react-json-view';
import { Segment, Button, Header, Icon, Label, Popup } from 'semantic-ui-react';
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

export class JsonEditor extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            json: props.jsonObj,
            collapsed: true,
            showSaveSettingsConfirm: false,
            expanded: true,
        };
    }

    updateJson = () => {
        this.props.onSave(JSON.stringify(this.state.json));
        this.toggleConfirmModal();
    };

    onSchemaChange = (json) => {
        this.setState({
            json,
        });
    };

    toggleConfirmModal = () => {
        this.setState({
            showSaveSettingsConfirm: !this.state.showSaveSettingsConfirm,
        });
    };

    render() {
        const editorProps = {
            theme: 'rjv-default',
            name: false,
            src: null,
            collapsed: false,
            collapseStringsAfter: 15,
            onAdd: true,
            onEdit: true,
            onDelete: true,
            displayObjectSize: true,
            enableClipboard: true,
            indentWidth: 4,
            displayDataTypes: true,
            iconStyle: 'triangle',
        };

        return (
            <>
                <ConfirmChange
                    visible={this.state.showSaveSettingsConfirm}
                    toggleModal={this.toggleConfirmModal}
                    onConfirm={this.updateJson}
                />
                <div style={{ textAlign: 'center' }}>
                    <div>
                        <Header as='h4'>
                            <Icon name='settings' />
                            <Header.Content>
                                Persisted Script Inputs
                                <Header.Subheader as='h6'>
                                    (Overriden by Conflicting Job Settings)
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </div>
                <Segment style={{ width: '350px' }}>
                    <Popup
                        content={this.props.toolTip}
                        on='hover'
                        trigger={<Label attached='top'>Settings JSON:</Label>}
                    />
                    <ReactJson
                        collapsed={this.state.collapsed}
                        style={{
                            padding: '10px',
                            borderRadius: '3px',
                            margin: '10px 0px',
                        }}
                        name={editorProps.name}
                        theme={editorProps.theme}
                        src={this.state.json}
                        collapseStringsAfterLength={
                            editorProps.collapseStringsAfter
                        }
                        onEdit={(e) => {
                            this.onSchemaChange(e.updated_src);
                        }}
                        onDelete={(e) => {
                            this.onSchemaChange(e.updated_src);
                        }}
                        onAdd={(e) => {
                            this.onSchemaChange(e.updated_src);
                        }}
                        displayObjectSize={editorProps.displayObjectSize}
                        enableClipboard={editorProps.enableClipboard}
                        indentWidth={editorProps.indentWidth}
                        displayDataTypes={editorProps.displayDataTypes}
                        iconStyle={editorProps.iconStyle}
                    />
                </Segment>
                <div style={{ textAlign: 'right' }}>
                    <Button primary onClick={() => this.toggleConfirmModal()}>
                        Save
                    </Button>
                </div>
            </>
        );
    }
}
