import React, { useState } from 'react';
import {
    Header,
    Grid,
    Dimmer,
    Loader,
    Modal,
    Button,
    Label,
    Segment
} from 'semantic-ui-react';
import AceEditor from "react-ace";
import JsonViewer from './JsonViewer';

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/mode-python";
import "ace-builds/src-min-noconflict/theme-solarized_dark";
import 'ace-builds';
import "ace-builds/webpack-resolver";

export function TransformScriptBuilderModal(props) {
    
    const {
        myResult,
        test_job,
        pipelineStep,
        toggleModalVisible,
        visible,
        updatePipelineStep,
        handleTestTransformForResult
    } = props;

    const [transform, updateTransform] = useState(pipelineStep && pipelineStep.input_transform ? pipelineStep.input_transform : "No transform...");

    const style = {
        padding: "10px",
        borderRadius: "3px",
        margin: "10px 0px",
        maxHeight: "200px",
        width: "100%"
    };

    let transformed_data = {};
    try {
        transformed_data = test_job.test_transforms[myResult.id];
    } catch {}

    if (!myResult) {
        return (
            <Modal
                onClose={() => toggleModalVisible()}
                open={visible}
            >
                <Modal.Header>Test New Data Transforms</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            It doesn't appear you've run a test job or else something has gone wrong,
                            and this node doesn't have any results.
                        </Modal.Description>
                    </Modal.Content>
            </Modal>
        );
    }

    let input_data = { data: null };
    if (myResult.raw_input_data) {
        try {
            input_data = JSON.parse(myResult.raw_input_data);
        } catch {}
    }

    return (
        <Modal
            onClose={() => toggleModalVisible()}
            open={visible}
        >
            <Modal.Header>Test New Data Transforms</Modal.Header>
            <Modal.Content>
                <Dimmer active={test_job.transform_loading} inverted>
                    <Loader size='tiny' inverted>Applying Transform...</Loader>
                </Dimmer>
                <Grid columns={1}>
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Test Out New Transform Scripts</Header>
                            <p>
                                Test out different Python transformation scripts to see how input_data from preceding nodes
                                will be be altered by this node before passing them its script. Useful to adjust output data
                                from an existing script / node to match what you need for a different node. This lets you mix
                                and match nodes more easily. 
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid columns={2} divided>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Segment style={{maxHeight:'30vh'}}>
                                            <Label attached='top'>Input Data:</Label>
                                            <JsonViewer collapsed={false} jsonObj={input_data}/>
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment style={{maxHeight:'30vh'}}>
                                            <Label attached='top'>Transformed Data:</Label>
                                            <JsonViewer collapsed={false} jsonObj={transformed_data ? transformed_data : { message: "It appears no test transforms are available."}}/>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment style={{maxHeight:'30vh'}}>
                                <Label attached='top'>Draft Transform Script</Label>
                                    <AceEditor
                                        style={style}
                                        mode="python"
                                        theme="tomorrow"
                                        name="code_editor"
                                        fontSize={11}
                                        showPrintMargin={true}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        value={ transform }
                                        onChange={updateTransform}
                                        setOptions={{
                                            enableBasicAutocompletion: true,
                                            enableLiveAutocompletion: true,
                                            enableSnippets: true,
                                            showLineNumbers: true,
                                            tabSize: 4,
                                        }}/>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button
                                floated='right'
                                size='mini'
                                icon='play'
                                content='Test'
                                color='orange'
                                onClick={() => handleTestTransformForResult(myResult.id, transform)}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button 
                    content="Cancel"
                    labelPosition='right'
                    icon='exit'
                    negative
                    onClick={() => toggleModalVisible}
                />
                <Button
                    content="Save"
                    labelPosition='right'
                    icon='save'
                    positive
                    onClick={() => {
                        let updatedStep = {...pipelineStep};
                        updatedStep.input_transform = transform;
                        updatePipelineStep(updatedStep);
                    }}
                />
            </Modal.Actions>
            </Modal>
           
    );
}