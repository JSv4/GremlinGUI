import React from 'react'
import { Card, Header, Icon, Label } from 'semantic-ui-react'

export const PipelineHeaderWidget = (props) => {
    
    const { 
        selectedPipeline,
    } = props;

    if (!selectedPipeline) return <></>;

    return (
        <Card>
            <Card.Content>
                <Header as='h3'>
                    <Icon name='code branch' />
                    <Header.Content>
                        <strong>Pipeline:</strong> {selectedPipeline.name} <br/> (ID #{selectedPipeline.id})
                        <Header.Subheader>In Production: {selectedPipeline.production ? <Label color='green' size='mini'>YES</Label> : <Label color='red' size='mini'>NO</Label> }</Header.Subheader>
                    </Header.Content>
                </Header>
            </Card.Content>
        </Card>
    );

}