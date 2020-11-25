import React from 'react';
import { connect } from "react-redux";
import { 
    Button,
    Card,
    Image,
    Dimmer,
    Loader
} from 'semantic-ui-react';
import _ from 'lodash';
import { StepStatusLabel } from '../../../Shared/StatusLabels';

import { runTestJobToNode } from '../../../../Redux/actions';

const PipelineNode = (props) => {

    function handleRunTestJobToNode(nodeId) {
        props.dispatch(runTestJobToNode(nodeId));
    }

    const { node, test_job, application } = props;
    const { buildMode } = application;

    let myId = parseInt(node.id);

    let myResult = null;
    try {
        myResult = _.find(test_job.test_results, {pipeline_node: myId})
    } catch {}

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
                <Card>
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
                        <Card.Header>
                            {node.name} (<b>ID {node.id}</b>)
                        </Card.Header>
                        <Card.Meta>Script: {node.script.human_name}</Card.Meta>
                        <Card.Description>
                            {node.script.description}
                            <i>
                                {node.script.type === 'RUN_ON_JOB'
                                    ? 'This script will run single-threaded over all documents in a job, sequentially.'
                                    : 'This script will run multithreaded over all document in a job, in parallel.'}
                            </i>
                            {buildMode ? 
                                <>
                                    <br/>
                                    <br/>
                                    <StepStatusLabel step={myResult} buildMode={buildMode}/>
                                </> : 
                                <></>
                            } 
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                            <div style={{ textAlign: 'right' }}>
                                <Button circular color='red' icon='trash' />
                                {buildMode && test_job.test_job ? 
                                    <Button
                                        circular
                                        color='green'
                                        icon='play'
                                        onClick={() => handleRunTestJobToNode(myId)}
                                    />
                                    :
                                    <></>
                                }
                            </div>
                        </Card.Content>
                    
                </Card>
            </div>
        );
    } else {
        return (
            <div>
                <Card>
                    <Card.Content>
                    { loaderObj }
                    <Image
                        floated='right'
                        size='mini'
                        src='start_icon_128.png'
                    />
                    <Card.Header>START SCRIPT: Extracter</Card.Header>
                    <Card.Meta>Script: {node.script.id === -1 ? "Built-In" : node.script.human_name}</Card.Meta>
                    {
                        buildMode ? 
                            <Card.Description>
                                <StepStatusLabel step={myResult} buildMode={buildMode}/>
                            </Card.Description>
                            :
                            <></>
                    }
                    </Card.Content>
                </Card>
            </div>

        );
    }
};


function mapStateToProps(state) {
    
    const {
        test_job, 
        application, 
        scripts
    } = state;
  
    return {
        test_job, 
        application,
        scripts
    };
  }

export default connect(mapStateToProps)(PipelineNode);