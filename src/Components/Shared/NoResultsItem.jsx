import React from 'react'
import { Item, Placeholder } from 'semantic-ui-react';
import SupportedFileTypes from './SupportedFileTypes';

export const NoResultsItem = () => {
    
    return(
        <Item key='No_Result'>
            <Item.Image src='/images/wireframe/image.png' />
            <Item.Content>
                <Item.Header as='a'>No Matching Pipelines</Item.Header>
                <Item.Meta>
                    <Placeholder.Line />
                </Item.Meta>
                <Item.Description>
                    <Placeholder fluid>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                        <Placeholder.Paragraph>
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Paragraph>
                    </Placeholder>
                </Item.Description>
                <Item.Extra>
                    <SupportedFileTypes extensions={[]}/>
                </Item.Extra>
            </Item.Content>
        </Item>
    );
}

