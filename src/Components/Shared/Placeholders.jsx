import React from 'react';
import {
    Segment, 
    Dimmer,
    Loader, 
    Placeholder
} from 'semantic-ui-react';

export function SidebarLoadingPlaceholder(props) {
    return (
        <Segment style={{width:'100%', height:'100%'}}>
            <Dimmer active inverted>
                <Loader inverted>{props.LoadingText}</Loader>
            </Dimmer>
            <Placeholder>
                <Placeholder.Image rectangular />
            </Placeholder>
        </Segment>
    );
}