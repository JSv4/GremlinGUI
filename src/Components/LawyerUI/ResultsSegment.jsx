import React from 'react';
import { 
    Table,
    Icon,
    Pagination,
    Header,
    Dimmer, 
    Loader, 
    Segment,
    Form,
    Label
} from 'semantic-ui-react';

import { JobRow } from './Jobs/JobRow';
import { JobTable } from './Jobs/JobTable';

import _ from 'lodash';

export const ResultsSegment = (props) => {

    const { jobs } = props;

    // Render the results rows, or, if there are no results, then show empty row
    let grid = [];
    if (jobs.items.length > 0) {
        grid = jobs.items.map((job) => 
        <JobRow 
            key={job.id}
            job={job}
            selected={jobs.selectedJobId===job.id}
            onDownload={props.handleDownloadJob}
            handleDeleteJob={props.handleDeleteJob}
            handleUpdateJob={props.handleUpdateJob}
            handleSelectJob={props.handleSelectJob}
        />);
    }
    else {
        grid = [<Table.Row key='EmptyJobRow'>
                    <Table.Cell textAlign='center' colSpan="3">
                        <Header textAlign='center' icon>
                            <Icon size='small' name='pdf file outline' />
                            No Matching Jobs...
                        </Header>
                    </Table.Cell>
                </Table.Row>];
    };

    return (  
        <Segment style={{width:'80vw', height:'100%', backgroundColor:'#f3f4f5'}}>
            <div 
                style={{
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center', 
                height: '100%',
                width: '100%'
            }}>
                <Dimmer active={jobs.loading} inverted>
                    <Loader inverted>Loading...</Loader>
                </Dimmer>
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'flex-end',
                    width: '100%'
                }}>
                    <div style={{width:'25vw', height:'10%'}}>
                        <Label
                            color='blue'
                            corner='left' 
                            icon='home'
                            onClick={props.setHomeView}
                        />
                        <Form onSubmit={() => props.handleFetchJobs()}>
                            <Form.Input
                                icon={<Icon name='search' inverted circular link />}
                                placeholder='Search Results...'
                                onChange={(data)=> props.handleSetJobsSearchString(data.target.value)}
                                value={jobs.searchText}
                            />
                        </Form>
                    </div>
                </div>
                <Segment style={{height:'80%', width:'100%', overflowY:'scroll'}}>
                    <JobTable>
                        { grid }
                    </JobTable>
                </Segment>
                <Pagination
                    style={{height:'10%'}}
                    activePage={jobs.selectedPage}
                    onPageChange={(e, { activePage }) => props.handleSelectJobPage(activePage)}
                    totalPages={jobs.total_pages}
                />
            </div>
        </Segment>
    );
}  