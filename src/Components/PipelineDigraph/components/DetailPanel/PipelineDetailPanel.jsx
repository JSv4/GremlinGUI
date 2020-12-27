import React, { PureComponent } from 'react';
import { 
    Tab,
    Segment,
    Grid,
    Dimmer, 
    Loader,
    Placeholder,
    Button, 
    Icon, 
    Header,
    Divider,
    Popup, 
    Accordion
} from 'semantic-ui-react';
import _ from 'lodash';

//import SupportedFileTypes from "../../../Shared/SupportedFileTypes";
import JobSettings from '../../../Shared/JobSettings';
import { JobDocumentReadOnlyTab } from '../../../Shared/SidebarTabs';
import PipelineMetaModel from '../Modals/PipelineMetaModal';
import JsonViewer from '../../../Shared/JsonViewer';
import { DocumentList } from '../../../Documents/DocumentList';
import { JobStatusCol } from '../../../Shared/Controls';
import { PipelinePanelHeader } from '../../../Shared/DetailsWidgets';

export class PipelineDetailPanel extends PureComponent {

    onPipelineDescriptionOrNameChange = (newName, newDescription) => {
        let { selectedPipelineId } = this.props.pipelines;

        if (selectedPipelineId !== -1) {

            let updatedPipeline = {
                id: selectedPipelineId,
                description: newDescription,
                name: newName
            };

            this.props.handleUpdatePipeline({...updatedPipeline, });
        }   
    }

    onProductionStatusChange = (status) => {
        let oldPipelineObj = _.find(this.props.pipelines.items, { 'id': this.props.pipelines.selectedPipelineId })
        this.props.handleUpdatePipeline({...oldPipelineObj, production:status});
    }

    constructor(props) {
        super(props);
        this.state={
            showDeleteConfirm: false,
            showMetaModal: false,
            showInputs: false
        };
    }

    render() {

        let { test_job } = this.props.test_job;
        const { 
            testJobLogsLoading,
            buildMode,
            sidebarTab,
            selectedPipeline
        } = this.props;

        let fileTypes = [];
        try {
           fileTypes = JSON.parse(selectedPipeline.supported_files).supported_files;
        } catch (e) {}
    
        let ProductionButton = selectedPipeline && selectedPipeline.production ? 
        <Button
            icon
            circular
            size='mini'
            color='green'
            floated='right'
            onClick={() => this.onProductionStatusChange(false)}
            labelPosition='right'
        >
            <Icon name='eject' />
            Take Offline
        </Button> : 
        <Button
            icon
            circular
            size='mini'
            color='grey'
            floated='right'
            onClick={() => this.onProductionStatusChange(true)}
            labelPosition='right'
        >
            <Icon name='play' />
            Put Into Production
        </Button>;

        let tabs = [];
        if (!selectedPipeline) {
            return (
                <Segment
                    style={{
                        overflowY:'hidden',
                        height:'100%',
                        width:'100%',
                        margin:'0px'
                    }}
                >
                    <Dimmer active inverted>
                        <Loader inverted>Loading Data...</Loader>
                    </Dimmer>
                    <Placeholder>
                        <Placeholder.Image rectangular />
                    </Placeholder>
                </Segment>
            );
        }
        else
        {
            // Get the pipeline schema from the fetched Gremlin model data and parse it to JSON
            let pipelineSchema = {};
            try {
                pipelineSchema = JSON.parse(selectedPipeline.schema);
            } catch {}

            tabs = [
                (<>
                    <PipelineMetaModel
                        description={selectedPipeline ? selectedPipeline.description : ""}
                        name={selectedPipeline ? selectedPipeline.name : ""}
                        onChange={this.onPipelineDescriptionOrNameChange}
                        visible={this.state.showMetaModal}
                        toggleModal={() => this.setState({showMetaModal: !this.state.showMetaModal})}
                    />
                    <Grid>
                        {buildMode ? 
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <JobStatusCol
                                        style={{
                                            width:"100%",
                                            marginTop:"10px",
                                            backgroundColor: '#6435c9'
                                        }}
                                        job={this.props.test_job.test_job}
                                        pipeline={selectedPipeline}
                                        jobLogsLoading={testJobLogsLoading}
                                        handleUpdateJob={this.props.handleUpdateTestJob}
                                    />
                                </Grid.Column>
                            </Grid.Row> 
                            :
                            <Grid.Row>  
                                <Grid.Column width={16}>
                                    <Segment>
                                        <div style={{padding: '10px'}}>
                                            <Header as='h2'>
                                                <Header.Subheader>
                                                {selectedPipeline.description}
                                                <Popup
                                                        content="Edit Pipeline Description or name"
                                                        position='top right' 
                                                        trigger={
                                                            <Button
                                                                floated='right'
                                                                circular
                                                                icon='edit'
                                                                onClick={() => this.setState({showMetaModal: !this.state.showMetaModal})}
                                                            />
                                                        }
                                                    />
                                                </Header.Subheader>
                                            </Header>
                                        </div>
                                        <Divider horizontal>Supported File Types:</Divider>
                                        {/* <SupportedFileTypes extensions={fileTypes}/> */}
                                    </Segment> 
                                </Grid.Column>                                
                            </Grid.Row>
                        }
                        <Grid.Row>
                            <Grid.Column>
                                <Button
                                    icon
                                    circular
                                    size='mini'
                                    floated='right'
                                    color='red'
                                    labelPosition='right'
                                    onClick={() => this.setState({showDeleteConfirm: !this.state.showDeleteConfirm})}
                                >
                                    <Icon name='trash'/>
                                    Delete
                                </Button>
                                { ProductionButton }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </>),
                (<JsonViewer 
                    collapsed={false}
                    jsonObj={pipelineSchema}
                    title='Pipeline Schema:'
                />)
            ];

            if (this.props.buildMode) {

                let input_data = {data:"No inputs provided..."};
                try {
                    input_data = JSON.parse(test_job.job_inputs);
                } catch {}

                tabs.push(
                    (<div key ='inputs'>
                        {
                            test_job && test_job.started ? 
                                <JobDocumentReadOnlyTab
                                    documents={test_job.test_documents}
                                    selectedPage={test_job.document_page}
                                    pageCount={test_job.document_pages}
                                    handleDownloadDocument={this.props.handleDownloadDocument}
                                    handleChangePage={this.props.handleTestDocumentPageChange}
                                />
                                : 
                                <>
                                    <Accordion fluid styled>
                                        <Accordion.Title
                                            active={this.state.showInputs}
                                            index={0}
                                            onClick={() => this.setState({
                                                showInputs: !this.state.showInputs
                                            })}
                                        >
                                            <Icon name='dropdown' />
                                            Adjust Job Inputs
                                        </Accordion.Title>
                                        <Accordion.Content active={this.state.showInputs}>
                                            <JobSettings
                                                job={test_job}
                                                jobSettings={input_data}
                                                handleUpdateJob={this.props.handleUpdateTestJob}
                                            />
                                        </Accordion.Content>
                                    </Accordion>
                                    <DocumentList
                                        documents={this.props.test_job.test_documents}
                                        page={this.props.test_job.document_page}
                                        pages={this.props.test_job.document_pages}
                                        onDelete={this.props.handleDeleteTestDocument}
                                        onUpload={this.props.handleUploadTestDocument}
                                        onDownload={this.props.handleDownloadDocument}
                                        handleSelectDocumentPage={this.props.handleTestDocumentPageChange}
                                    />
                                </>
                        }
                    </div>));
            }

        }
        
        return (
            <Segment
                style={{
                    overflowY:'hidden',
                    height:'100%',
                    width:'100%',
                    margin:'0px'
                }}
            >
                <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                    <Popup
                        content="Enable test mode so you can run the pipeline as you build it."
                        position='top right' 
                        trigger={
                            <div style={{marginBottom:'.5vh'}}>
                                <Button
                                    circular
                                    size='mini'
                                    color={buildMode ? 'purple' : 'grey'}
                                    onClick={() => this.props.toggleTestMode(selectedPipeline.id)}
                                >
                                    TEST
                                </Button>
                            </div>
                        }
                    />
                    <PipelinePanelHeader selectedPipeline={selectedPipeline}/>
                    {tabs[sidebarTab]}
                </div>
            </Segment>
        );
    }
    
}
