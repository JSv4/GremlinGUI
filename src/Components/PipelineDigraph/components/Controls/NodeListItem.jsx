import React from 'react';
import { Card, Image, Icon, Label } from 'semantic-ui-react';

export const NodeListItem = (props) => {
    const { script, selected, onSelect } = props;

    // Try to decode the supported extensions and handle any failures gracefully
    let supportedExtensions = [
        <Label key='allExts' size='mini' color='teal'>
            All
        </Label>,
    ];
    
    try {
        let exts = JSON.parse(script.supported_file_types);
        supportedExtensions = exts.map((ext) => (
            <Label key={ext} size='mini' color='teal'>
                {ext}
            </Label>
        ));
    } catch (e) {}

    // Get the proper icon based on the job type.
    let imageUrl = '';
    switch (script.type) {
        case 'RUN_ON_JOB_DOCS_PARALLEL':
            imageUrl = './parallel_job.png';
            break;
        case 'RUN_ON_JOB':
            imageUrl = './serial_job.png';
            break;
        default:
    }

    return (
        <Card
            key={script.id}
            onClick={() => onSelect(script.id)}
            style={selected ? { margin:'5px', backgroundColor: '#e2ffdb' } : {margin:'5px'}}
        >
            <Card.Content>
                <Image floated='right' size='mini' src={imageUrl} />
                <Card.Header>{script.human_name.substring(0, 16)}</Card.Header>
                <Card.Meta>
                    <div>{supportedExtensions}</div>
                </Card.Meta>
                <Card.Description>{props.script.description}</Card.Description>
            </Card.Content>
        </Card>
    );
};

export const EmptyListItem = (props) => {

    return (
        <Card
            key={-1}
            style={{margin:'5px'}}
        >
            <Card.Content> 
                <Card.Header><Icon floated='right' name='cancel'/>No Matching Scripts</Card.Header>
                <Card.Meta>
                    <div>N/A</div>
                </Card.Meta>
                <Card.Description>No scripts are available or the search terms you entered do not appear to match any of the scripts available on the system.</Card.Description>
            </Card.Content>
        </Card>
    );
};
