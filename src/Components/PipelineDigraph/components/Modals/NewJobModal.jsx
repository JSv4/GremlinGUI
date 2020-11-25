import React, {Component} from 'react';
import { 
    Label,
    Icon,
    Modal,
    Table,
    Button,
    Form,
    Divider,
    Segment,
    Header} from 'semantic-ui-react';
import jsf from 'json-schema-faker';
import _ from 'lodash';

function PipelineChoiceRow(props) {
    return(
        <Table.Row 
            key={props.pipeline.id}
            onClick={() => props.handleSelectPipeline(props.pipeline.id)}
            style={props.selected ? {backgroundColor: '#e2ffdb'} : {}}
        > 
            <Table.Cell>{props.pipeline.name}</Table.Cell>
            <Table.Cell>{props.pipeline.total_steps}</Table.Cell>
            <Table.Cell>{props.pipeline.description}</Table.Cell>
        </Table.Row>
    );
}

//This is a pop-up modal that lets you create a new job.
export default class NewJobModal extends Component {

    // Gremlin builds a schema for a given pipeline based on the schemas stored in each of the scripts used in the pipeline
    // Json-schema-faker can take this jsonschema and use it to create a valid input. If you provide examples 
    // in your jsonschema, this generated schema will actualy be sufficient to run the job (though perhaps not what you want)
    createInitialSchema = () => {
        try {

            let inputs = {};

            const pipe = _.find(this.props.pipelines.items, {id: this.props.pipelines.selectedPipelineId});
            console.log("Pipe: ",pipe);
            let initialJobSettings = {schema: {}};
            console.log("initialJobSettings: ", initialJobSettings);
            let schema = JSON.parse(pipe.schema).schema;
            console.log("Schema: ",schema);
            
            jsf.option({ 
                optionName: 'value',
                ignoreMissingRefs: true,
                useExamplesValue: true 
            });

            // Build job input placeholder from schema object
            for (var prop in schema) {
                if (Object.prototype.hasOwnProperty.call(schema, prop)) {
                    inputs[prop] = {
                        name: schema[prop]['name'],
                        schema: jsf.generate(schema[prop]['schema'])
                    }
                }
            }
            
            console.log("initialJobInputs: ", inputs);
            return JSON.stringify(inputs);   
        }
        catch(e) {
            console.log("Error building schema: ", e);
            return JSON.stringify({});
        }
    }

    render() {

        const { pipelines, visible, application } = this.props;

        let activePipelines = pipelines.items ? pipelines.items : []; // ? pipelines.items.filter(pipeline => pipeline.production) : [];

        return(
            <Modal open={visible} size = 'small'>
              <Label 
                  corner='right'
                  color='grey'
                  icon='cancel'
                  onClick={()=>this.props.handleNewJobModalToggle()}
              />
              <Modal.Content>
                { activePipelines.length > 0 ? <div>
                        <Form>
                            <Form.Field>
                                <label>New Job Name:</label>
                                <input value={application.newJobName} onChange = {(data) => { this.props.handleUpdateNewJobName(data.target.value)}}/>
                            </Form.Field>
                        </Form>
                        <Divider horizontal/>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Pipeline Name</Table.HeaderCell>
                                    <Table.HeaderCell>Pipeline Steps</Table.HeaderCell>
                                    <Table.HeaderCell>Pipeline Description</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    activePipelines.map((pipeline) => (<PipelineChoiceRow key={pipeline.id} pipeline={pipeline} selected={pipeline.id===pipelines.selectedPipelineId} handleSelectPipeline={this.props.handleSelectPipeline}/>))
                                }
                            </Table.Body>
                        </Table>
                    </div> : <Segment placeholder>
                        <Header icon>
                        <Icon name='random' />
                            No Pipelines Available...
                        </Header>
                    </Segment> }
              </Modal.Content>
              <Modal.Actions>
                { activePipelines.length > 0 ? <Button color='green' onClick={() => this.props.handleCreateJob({
                    name: application.newJobName,
                    pipeline: pipelines.selectedPipelineId, 
                    job_inputs: this.createInitialSchema()
                })}>
                    <Icon name='checkmark' /> Create
                </Button> : <div/>}
              </Modal.Actions>
            </Modal>
          );
    }
}
