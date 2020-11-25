import React from 'react'
import { Card } from 'semantic-ui-react';
import SupportedFileTypes from '../Shared/SupportedFileTypes';


export const PipelineCard = (props) => {
    
    let {pipeline, selected, maxLength} = props;

    // Parse the file type json from the string stored in the db
    let fileTypes = [];
    try {
    fileTypes = JSON.parse(props.pipeline.supported_files).supported_files;
    } catch (e) {}

    let description = pipeline.description !== "" ? 
                        pipeline.description : 
                        `There appears to be no description for this analysis. ` + 
                        `Contact the author at ${pipeline.owner_email} for more information.`; 

    console.log("Description length: ", description.length);

    return (
        <Card 
            fluid
            style={ props.selectedPipelineId===pipeline.id ? {backgroundColor: '#2185d0'} : {}}
            onClick={() => props.handleSelectPipeline(pipeline.id)}
        >
            <Card.Content>
                <Card.Header>{pipeline.name}</Card.Header>
                <Card.Meta><span>Author: {pipeline.owner}</span></Card.Meta>
                <Card.Description>
                    {description}
                </Card.Description>
                <Card.Meta>
                    <SupportedFileTypes extensions={fileTypes}/>
                </Card.Meta>
            </Card.Content>
        </Card>
    );
}

