import React from 'react'
import { 
    Card, 
    Segment,
    Pagination,
    Dimmer,
    Loader,
    Form,
    Icon
} from 'semantic-ui-react';
import { PipelineCard } from './PipelineCard';
import { NoResultsItem } from '../Shared/NoResultsItem';

export const PipelineView = (props) => {
    
    const {pipelines} = props;
    
    let items = [];
    if (pipelines.items.length > 0) {
        for (let count = 0; count < pipelines.items.length; count++) {
            items.push(<PipelineCard 
                            key={count}
                            handleSelectPipeline={props.handleSelectPipeline}
                            pipeline={pipelines.items[count]}
                            maxLength={50}
                            selectedPipelineId={props.pipelines.selectedPipelineId}
                        />);
        }
    }
    else {
        items.push(<NoResultsItem/>);
    }
    
    return (
        <Segment style={{width:'100%', height:'100%', backgroundColor:'#f3f4f5'}}>
            <div 
                style={{
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center', 
                height: '100%',
                width: '100%'
            }}>
                <Dimmer active={pipelines.loading} inverted>
                    <Loader inverted>Loading...</Loader>
                </Dimmer>
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'flex-end',
                    width: '100%'
                }}>
                    <div style={{width:'25vw', height:'10%'}}>
                        <Form onSubmit={() => props.refreshPipelines()}>
                            <Form.Input
                                icon={<Icon name='search' inverted circular link />}
                                placeholder='Search...'
                                onChange={(data)=> props.handleSetPipelineSearchString(data.target.value)}
                                value={pipelines.pipelineSearchText}
                            />
                        </Form>
                    </div>
                </div>
                <Segment style={{height:'80%', width:'100%', overflowY:'scroll'}}>
                    <Card.Group itemsPerRow={2} style={{width:'100%'}}>
                        {items}
                    </Card.Group>
                </Segment>
                <Pagination
                    style={{height:'10%'}}
                    activePage={pipelines.selectedPage}
                    onPageChange={(e, { activePage }) => console.log("Page change: ", activePage)}
                    totalPages={pipelines.pages}
                />
            </div>
        </Segment>
    );
}