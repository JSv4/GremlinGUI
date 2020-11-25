import React from 'react'
import { 
    Grid,
    Button,
    Header,
    Icon, 
    Segment,
    Divider, 
    Form,
    Image
} from 'semantic-ui-react';

export const LandingSegment = (props) => {
    
    return (
        <div style={{
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center', 
                height: '75vh',
                width: '100%'
            }}>
            <div style={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center', 
                }}>
                <div>
                    <Image circular src='/gremlin_128.png' size='tiny'/>
                </div>
                <div>
                    
                    <Header as='h2' textAlign='center'>
                        Welcome to Gremlin
                        <Header.Subheader>
                        Click "Analyze" below to analyze a document or search for a completed job.
                        </Header.Subheader>
                    </Header>
                </div>
            </div>
            <Segment placeholder style={{width: '75vw'}}>
                <Grid columns={2} textAlign='center'>
                    <Divider vertical>Or</Divider>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                            <Header icon>
                                <Icon name='search' />
                                View Results
                            </Header>
                            <div style={{
                                width:'100%',
                                display:'flex',
                                flexDirection:'row',
                                justifyContent:'center', 
                                alignItems:'center'}}
                            >
                                <div>
                                    <Form onSubmit={() => props.handleLandingJobSearch()}>
                                        <Form.Input
                                            icon={<Icon name='search' inverted circular link />}
                                            placeholder='Search Jobs...'
                                            onChange={(data)=> props.handleSetJobsSearchString(data.target.value)}
                                            value={props.jobs.searchText}
                                        />
                                    </Form>
                                </div>
                                <div style={{marginLeft:'5px', marginRight:'5px'}}>
                                    <b>-OR-</b>
                                </div>
                                <div>
                                    <Button primary onClick={props.setResultView}>Browse</Button>
                                </div>
                            </div>
                        </Grid.Column>
                
                        <Grid.Column>
                        <Header icon>
                            <Icon name='file text outline' />
                            Analyze Documents
                        </Header>
                        <Button primary onClick={props.setWizardView}>Analyze</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
        );
}