import React from 'react'
import { Card, Header, Icon } from 'semantic-ui-react'
import { JobStatusLabels } from '../../../Shared/StatusLabels';

export const JobHeaderWidget = (props) => {
    
    const { 
        selectedJob,
    } = props;

    if (!selectedJob) return <></>;

    return (
        <Card>
            <Card.Content>  
                <div style={{width: '100%', height: '100%', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                    <div>
                        <Header as='h3'>
                            <Icon name='briefcase' />
                            <Header.Content>
                                <strong>Job:</strong> {selectedJob.name} <br/> (ID #{selectedJob.id})
                                <Header.Subheader>Pipeline: {selectedJob.pipeline.name}</Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                    <div>
                        <JobStatusLabels job={selectedJob}/>
                    </div>
                </div>   
            </Card.Content>
        </Card>
    );

}