import React from 'react';
import { 
    Segment,
    Grid,
    Divider,
    Header,
    Icon,
    Button
} from 'semantic-ui-react';
import _ from 'lodash';
import { JobControl } from './Jobs/JobControl';

export const JobResult = (props) => {
    
    const {results, handleDownloadResult} = props;
    let result = results ? _.find(results.items, {type:"JOB"}) : null;

    if (result) {
        return(
            <div>
                <Header icon>
                    <Icon name='file text' />
                    Download Results 
                </Header>
                <Button onClick={() => handleDownloadResult(result.id)} primary>Download</Button>
            </div>
        );
    }
    else {
        return (
            <div>
                <Header icon>
                    <Icon name='x' />
                    No Results Yet...
                </Header>
                <Button primary disabled>Download</Button>
            </div>
        );
    }
}

export const JobStatusStep = (props) => {
    
    const {results, selectedJob, pipelines, handleUpdateJob, handleDownloadResult} = props;

    let selectedPipeline = _.find(pipelines.items, {id: pipelines.selectedPipelineId})

    let completion_percent = 0;
    if (selectedPipeline && results) {
        if (selectedPipeline.nodes && results.items) {
            if (selectedPipeline.nodes.length > 0) {
                completion_percent = results.items.filter(item => item.type==="STEP" && item.finished).length / selectedPipeline.nodes.length;
            }
        }
    }

    return (
        <Segment placeholder style={{width:'100%', height:'100%', backgroundColor:'#f3f4f5'}}>
            <Grid columns={2} stackable textAlign='center'>
                <Divider vertical>Result:</Divider>
                <Grid.Row verticalAlign='middle'>
                    <Grid.Column>
                        <JobControl
                            job={selectedJob}
                            pipeline={selectedPipeline}
                            handleUpdateJob={handleUpdateJob}
                            completion_percent={completion_percent}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <JobResult results={results} handleDownloadResult={handleDownloadResult}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
}