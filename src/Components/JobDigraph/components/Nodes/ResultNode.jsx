import React from 'react';
import { connect } from "react-redux";
import { Card, Image, Loader, Dimmer } from 'semantic-ui-react';
import _ from 'lodash';
import { StepStatusLabel } from '../../../Shared/StatusLabels';

const ResultNode = (props) => {

    const { node, scripts, results } = props;

    let myScript = null;
    try {
        myScript = _.find(scripts.items, {id: node.script.id});
    } catch {}

    let myResult = null;
    try {
        myResult = _.find(results.items, {pipeline_node: parseInt(node.id)})
    } catch {}

    let nodeStyle = {};
    let loaderObj = <></>;
    
    if (myResult) {
        if (myResult.started) {
            if (!myResult.finished && !myResult.error) {
                loaderObj = <Dimmer active inverted><Loader size='medium'>Running...</Loader></Dimmer>;
            }
        }
    }

    if (node.type === 'THROUGH_SCRIPT') {
        return (
            <div>
                <Card style={nodeStyle}>
                    <Card.Content>
                        { loaderObj }
                        <Image
                            floated='right'
                            size='mini'
                            src={
                                node.script.type === 'RUN_ON_JOB'
                                    ? 'serial_job.png'
                                    : 'parallel_job.png'
                            }
                        />
                        <Card.Header>{node.name} (<b>ID {node.id}</b>)</Card.Header>
                        <Card.Meta>Script: {myScript ? myScript.human_name : "Can't Find Script."}</Card.Meta>
                        <Card.Description>
                            {myScript ? myScript.description : "Can't Find Script." }
                            <i>
                                {/* {myScript.type === 'RUN_ON_JOB'
                                    ? 'This script will run single-threaded over all documents in a job, sequentially.' : ""}
                                {myScript.type === 'RUN_ON_JOB_DOCS'
                                    ? 'This script will run multithreaded over all document in a job, in parallel.' : ""} */}
                            </i>
                            )
                            <br/>
                            <br/>
                            <StepStatusLabel step={myResult}/>
                        </Card.Description>
                    </Card.Content>
                </Card>
            </div>
        );
    } else {

        // Currently we only support custom through scripts. Anything else is assumed to be the default (hard-coded)
        // root node. Job status should dictate the 

        return (
            <div>
                <Card style={nodeStyle}>
                    <Card.Content>
                        { loaderObj }
                        <Image
                            floated='right'
                            size='mini'
                            src='start_icon_128.png'
                        />
                        <Card.Header>START SCRIPT: Extracter</Card.Header>
                        <Card.Meta>Script: {node.script.id === -1 ? "Built-In" : node.script.human_name}</Card.Meta>
                        <Card.Description>
                            Currently, the root node of every Gremlin job checks for any provided documents and extracts
                            any text found therein (OCRed PDFs, .docx, .doc, etc.). In the future, you'll be able to override
                            this default root step and write your own (or dispense with it entirely) in a new, advanced mode.
                            <br/>
                            <br/>
                            <StepStatusLabel step={myResult}/>
                        </Card.Description>
                    </Card.Content>
                </Card>
            </div>

        );
    }
};

function mapStateToProps(state) {
    
    const {
        results, 
        scripts
    } = state;
  
    return {
        results,
        scripts
    };
  }

export default connect(mapStateToProps)(ResultNode);