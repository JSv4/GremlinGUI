import * as React from 'react';
import { 
    Breadcrumb, 
    Segment, 
    Pagination
} from 'semantic-ui-react';
import Cookies from 'js-cookie';
import _ from 'lodash';

import { getJobLogs} from '../../Api/api';
import { HeaderContainer } from '../Layouts/Layouts';
import { DetailPanel } from './components/DetailPanel/DetailPanel'
import { PipelineTable } from './components/Controls/PipelineTable';
import PipelineRow from './components/Controls/PipelineRow';
import { PrimaryPipelineControls } from './components/Controls/PrimaryPipelineControls';
import { PipelineTrayControls } from './components/Controls/PipelineTrayControls';
import PipelineNode from './components/Nodes/PipelineNode';
import { Digraph } from '../Digraph/Digraph';
import { VerticallyCenteredDiv } from '../Shared/Wrappers';
import ConfirmModal from '../Shared/ConfirmModal';
import { CreateAndSearchBar, JobDigraphButtonPanel } from '../Shared/Controls';
import { PipelineHeaderWidget } from './components/Header/PipelineHeaderWidget';

class PipelineDigraphTab extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            job_log: "Click Start to Run Test Job...",
            log_fetching: false,
            running: false,
            showSidebar: true,
            timer: null,
            sidebarTab: 0,
            showDeleteConfirm:false
        }
    }

    toggleDeleteConfirm = () => {
        this.setState({
            showDeleteConfirm: !this.state.showDeleteConfirm
        });
    }

    toggleSidebar = () => {
        this.setState({
            showSidebar: !this.state.showSidebar
        });
    }

    openSidebar = () => {
        if (!this.state.showSidebar) this.setState({showSidebar: true});
    }
    
    closeSidebar = () => {
        if (this.state.showSidebar) this.setState({showSidebar: false});
    }

    setSidebarTab = (tabNum) => {
        if (this.state.sidebarTab === tabNum) {
            this.toggleSidebar();
        } else {
            this.setState({
                sidebarTab: tabNum
            }, this.openSidebar());
        }
    }

    componentDidMount() {

        let timer = setInterval(this.tick, 2000);
        this.setState({timer});

        // Refresh the pipelines
        this.props.fetchPipelines();

        // Refresh script summaries
        this.props.handleFetchScripts();

        //If we just loaded the page and already have a pipeline selected, 
        //make sure digraph is loaded
        if (this.props.pipelines.selectedPipelineId !== -1) {
            
            this.props.refreshSelectedPipelineDigraph();

            // If there's a test job... refresh test job data
            if (this.props.test_job.test_job) {
                this.props.refreshSummaryTestResults();
                this.props.handleRefreshTestJob()                
            }
        }
    }
 
    uploadPipelineYAML = (event) => {
        event.preventDefault();
        console.log(event.target.files[0]);
        this.props.handleUploadPipeline(event.target.files[0]);
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick = () => {

        let myJob = this.props.test_job.test_job;

        if(myJob) {
             // If job is running, get the results on each tick
            if (myJob.started && !myJob.finished && !myJob.error) {
                this.props.refreshSummaryTestResults();
            }
            //If job hasn't started, get documents on each tick.
            if (!myJob.started) {
                this.props.refreshTestDocuments();
            }

            if (!myJob.finished) { 
                this.props.handleRefreshTestJob();
            }
        }  
    }

    getLogs = async () => {
        try {
            let results = await getJobLogs(this.props.test_job.test_job.id, Cookies.get('token'));
            this.setState({ job_log: results.data.log, log_fetching: false });
        }
        catch(err) {
            this.setState({ job_log: `Error fetching logs: ${err}`, log_fetching: false });
        }
    };

    // If the user switches to test mode, alter the state and then create a test job on the backend
    // with this pipeline.
    toggleTestMode = () => {
        this.setState({
            job_log: "Click Start to Run Test Job...",
            log_fetching: false,
            running: false
        }, () => {
            this.props.handleToggleBuildMode();
        });
    }

    createPipelineEdge = (edge) => {
        console.log("Try to create pipeline edge...", edge);
        this.props.handleCreatePipelineEdge(edge[0].fromNodeId, edge[0].toNodeId)
    }

    onNodeMove = (nodeId, x_coord, y_coord) => {
        this.props.handleMovePipelineNode({
            id: nodeId,
            x_coord,
            y_coord
        });
    }

    onPipelineScale = (scale) => {
        this.props.handleScalePipeline({
            id: this.props.pipelines.selectedPipeline.id,
            scale
        });
    }

    onPipelineMove = (x_offset, y_offset) => {
        console.log("Handle canvas move: ",{x_offset, y_offset})
        this.props.handleMovePipeline({
            id: this.props.pipelines.selectedPipeline.id,
            x_offset,
            y_offset,
        })
    }

    render() {

        const fileInputRef = React.createRef();

        const { 
            results,
            pipelines,
            pipelinesteps,
            filterValue,
            scripts,
            buildMode,
            windowHeight 
        } = this.props;

        let selectedPipeline = _.find(pipelines.items, {id: pipelines.selectedPipelineId});

        let testJobResult = null;
        if (buildMode) {
            try {
                testJobResult = _.find(results.items, {type: 'JOB'});
            } catch {}
        } 

        let selectedNode = _.find(pipelinesteps.items, {id: pipelinesteps.selectedPipelineStepId});
        let selectedScript = selectedNode ? _.find(scripts.items, {id: selectedNode.script}) : null;
        
        let loadingText = "";
        if (selectedPipeline) {
            if(pipelines.loading) {
                loadingText="Loading pipeline...";
            }
            if(selectedPipeline.locked) {
                loadingText="Installing... Check back later.";
            }
        }

        let crumbs = [
            <Breadcrumb.Section
                key={0}
                link
                onClick={() => this.props.handleUnselectPipeline()}
            >
                Pipelines
            </Breadcrumb.Section>,
        ];

        if (selectedPipeline) {
            crumbs.push(<Breadcrumb.Divider key={1}/>);
            crumbs.push(
                <Breadcrumb.Section active key={2}>
                    {selectedPipeline.name}
                </Breadcrumb.Section>
            );
        }

        let breadcrumbs = 
            <Segment raised style={{width:'100%'}}>
                <Breadcrumb>
                    {crumbs}
                </Breadcrumb>
            </Segment>;

        let table = <PipelineTable>
          {pipelines.items.map((pipeline) => (
            <PipelineRow
                key={pipeline.id}
                onClick={() => this.props.handleSelectPipeline(pipeline.id)} 
                pipeline={pipeline}
                selected={selectedPipeline ? pipeline.id===selectedPipeline.id : false}
                toggleEditModal={this.props.handlePipelineModalToggle}
                handleDownloadPipeline={this.props.handleDownloadPipeline}
                onDelete={this.props.handleDeletePipeline}
            />))}
        </PipelineTable>;

        return (
            <VerticallyCenteredDiv>
                <ConfirmModal
                    visible={this.state.showDeleteConfirm} 
                    message="You have chosen to delete this pipeline. ARE YOU SURE? This cannot be undone. You will lose all pipeline relationships and settings."
                    yesAction={() => this.props.handleDeletePipeline(this.props.pipelines.selectedPipelineId)}
                    noAction={this.toggleDeleteConfirm}
                    toggleModal={this.toggleDeleteConfirm}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={this.uploadPipelineYAML}
                />
                { !selectedPipeline ? 
                    <div>
                        <CreateAndSearchBar
                            onChange={this.props.setPipelineNameFilter}
                            onCreate={this.props.handleNewPipelineModalToggle}
                            onSubmit={this.props.fetchPipelines}
                            onImport={() => fileInputRef.current.click()}
                            placeholder='Search Pipelines by Name...'
                            value={filterValue}
                        />
                    </div> : <></> }
                { !selectedPipeline ? 
                    <HeaderContainer
                        loading={this.props.pipelines.loading}
                        loadingText="Fetching Pipeline Details..."
                        body={table}
                        header={breadcrumbs}
                    /> :
                    <Digraph
                        digraphEngine={this.props.digraphEngine}
                        key={pipelines.selectedPipelineId}
                        toggleSidebar={this.toggleSidebar}
                        showSidebar={this.state.showSidebar}
                        exitDigraph={this.props.handleUnselectPipeline}
                        loadingText={loadingText}
                        detailPanel={
                            <DetailPanel
                                key={pipelines.selectedPipelineId}
                                selectedNode={selectedNode}
                                selectedPipeline={selectedPipeline}
                                handleUpdatePipelineStep={this.props.handleUpdatePipelineStep}
                                handleUpdatePipeline={this.props.handleUpdatePipeline}
                                handleScriptSelect={this.props.handleScriptSelect}
                                scripts={scripts}
                                results={results}
                                selectedScript={selectedScript}
                                pipelines={this.props.pipelines}
                                buildMode={buildMode}
                                test_job={this.props.test_job}
                                testJobResult={testJobResult}
                                testJobLogsLoading = {this.state.log_fetching}
                                toggleTestMode={this.toggleTestMode}
                                setSidebarTab={this.setSidebarTab}
                                sidebarTab={this.state.sidebarTab}
                                handleFetchResultData={this.props.handleFetchResultData}
                                handleDeleteTestDocument={this.props.handleDeleteTestDocument}
                                handleUploadTestDocument={this.props.handleUploadTestDocument}
                                handleDownloadDocument={this.props.handleDownloadDocument}
                                handleUpdateTestJob = {this.props.handleUpdateTestJob}
                                handleFetchTestJobStepLog={this.props.handleFetchTestJobStepLog}
                                handleFetchTestJobLog={this.props.handleFetchTestJobLog}
                                handleTestTransformForResult={this.props.handleTestTransformForResult}
                                handleTestDocumentPageChange ={this.props.handleTestDocumentPageChange}
                            />
                        }
                        controls={
                            <JobDigraphButtonPanel digraphEngine={this.props.digraphEngine}/>
                        }
                        trayControls={
                            <PipelineTrayControls
                                buildMode={buildMode}
                                selectedTab={this.state.sidebarTab}
                                selectTab={this.setSidebarTab}
                                selectedNode={selectedNode}
                            />
                        }
                        playControls={
                            <PrimaryPipelineControls
                                windowHeight={windowHeight}
                                scripts={scripts}
                                onAddNode={this.props.handleAddPipelineNode}
                                buildMode={buildMode}
                                handleUpdateJob = {this.props.handleUpdateJob}
                                test_job={this.props.test_job.test_job}
                                deletePipeline={this.toggleDeleteConfirm}
                                downloadPipeline={() => this.props.handleDownloadPipeline(pipelines.selectedPipelineId)}
                                downloadTestResult={this.props.handleDownloadJobResult}
                            />
                        }
                        // headerWidget={
                        //     <PipelineHeaderWidget selectedPipeline={selectedPipeline}/>
                        // }
                        nodeClass={PipelineNode}
                    />
                 }
                 { !selectedPipeline ? 
                      <div style={{
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        marginTop:'2vh'
                    }}>
                
                        <div>
                            <Pagination
                                activePage={pipelines.selectedPage}
                                onPageChange={(e, { activePage }) => this.props.handlePipelinePageChange(activePage)} 
                                totalPages={pipelines.pages}
                            />
                        </div>  
                    </div> : <></> 
                 }
            </VerticallyCenteredDiv>
        );
    }
}

export default PipelineDigraphTab;