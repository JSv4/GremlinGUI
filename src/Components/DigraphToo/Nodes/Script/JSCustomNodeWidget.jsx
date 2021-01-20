import * as React from 'react';
import { connect } from "react-redux";
import { PortWidget } from '@projectstorm/react-diagrams';
import { 
	Icon,
	Card,
	Dimmer,
	Loader,
	Image,
	Button,
	Label
} from 'semantic-ui-react';
import _ from 'lodash';

import { runTestJobToNode } from '../../../../Redux/actions';
import { StepStatusRibbons } from '../../../Shared/StatusLabels';


class JSCustomNodeWidget extends React.Component {
		
	handleRunTestJobToNode = (nodeId) => {
        this.props.dispatch(runTestJobToNode(nodeId));
    }

	render() {

		let cardStyle = {
			display:'flex',
			justifyContent:'center',
			minWidth:'150px',
			width:'7.5vw',
			margin: '0 auto'
		};

		const { 
			results, 
			scripts, 
			pipelinesteps, 
			node,
			application,
			test_job 
		} = this.props;
		const { buildMode } = application;
		
		// If there is no node object... return nothing
		if (!node) {
			return <></>
		}

		const myNode = _.find(pipelinesteps.items, {id: node.id});
		const myResult = _.find(results.items, {pipeline_node: node.id, type:"STEP"});
		const myScript = myNode.script ? _.find(scripts.items, {id: myNode.script}) : null;

		let loaderObj = <></>;
		if (myResult) {
			if (myResult.started) {
				if (!myResult.finished && !myResult.error) {
					loaderObj = <Dimmer active inverted><Loader size='medium'>Running...</Loader></Dimmer>;
				}
			}
		}
		
		if (pipelinesteps.selectedPipelineStepId===myNode.id)  cardStyle['backgroundColor']='#2185d0';

		if (myNode.type === 'THROUGH_SCRIPT') {
			return (
				<div>
					{ buildMode && test_job.test_job && !test_job.test_job.finished ? 
						<div style={{ textAlign: 'right', zIndex:200, position:'absolute', top:'-10px', right:'-10px' }}>
							<Button
								circular
								size='small'
								color='green'
								icon='play'
								onClick={() => this.handleRunTestJobToNode(myNode.id)}
							/>
						</div>
						: <></>
					}
					<div style={{position:'absolute', zIndex:100, top:'-15px', width:'100%' }}>
						<div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
							<div>
								<PortWidget engine={this.props.engine} port={this.props.node.getPort('in')}>
									<Icon circular inverted color='blue' name='arrow down'/>
								</PortWidget>
							</div>
						</div>
					</div>
					<Card style={cardStyle}>
						<Card.Content>
							{ loaderObj }
							{ myScript ? 
								<Image
									floated='right'
									size='mini'
									src={ myScript.type === 'RUN_ON_JOB' ? 'serial_job.png' : 'parallel_job.png'}
								/> : <Icon name='cancel'/> 
							}
							<Card.Header>{myNode.name} (<b>ID {myNode.id}</b>)</Card.Header>
							<Card.Meta>Script: {myScript ? myScript.human_name : "N/A"}</Card.Meta>
							<Card.Description><StepStatusRibbons step={myResult}/></Card.Description>
						</Card.Content>
					</Card>
					<div style={{position:'absolute', zIndex:100, bottom:'-15px', width:'100%' }}>
						<div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
							<div>
								<PortWidget engine={this.props.engine} port={this.props.node.getPort('out')}>
									<Icon circular inverted color='green' name='arrow down'/>
								</PortWidget>
							</div>
						</div>
					</div>
				</div>
			);
		}  else {

			// Currently we only support custom through scripts. Anything else is assumed to be the default (hard-coded)
			// root node. Job status should dictate the
			return (
				<div>
					<div style={{position:'absolute', zIndex:100, top:'-15px', width:'100%' }}>
						<div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
							<div>
								<PortWidget engine={this.props.engine} port={this.props.node.getPort('in')}>
									<Icon circular inverted color='blue' name='arrow down'/>
								</PortWidget>
							</div>
						</div>
					</div>
					<Card style={cardStyle}>
						<Card.Content>
							{ loaderObj }
							<Image
								floated='right'
								size='mini'
								src='start_job.png'
							/>
							<Card.Header>START SCRIPT: Extracter</Card.Header>
							<Card.Meta>Script: { myScript ? myScript.human_name : "N/A"}</Card.Meta>
							<Card.Description><StepStatusRibbons step={myResult}/></Card.Description>
						</Card.Content>
					</Card>
					<div style={{position:'absolute', zIndex:100, bottom:'-15px', width:'100%' }}>
						<div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
							<div>
								<PortWidget engine={this.props.engine} port={this.props.node.getPort('out')}>
									<Icon circular inverted color='green' name='arrow down'/>
								</PortWidget>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

function mapStateToProps(state) {
    
    const {
		results,
		application, 
		scripts,
		pipelinesteps, 
		test_job
    } = state;
  
    return {
		results,
		application,
        scripts,
		pipelinesteps,
		test_job
    };
  }

export default connect(mapStateToProps)(JSCustomNodeWidget);