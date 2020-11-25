import React, { Component } from 'react';
import { Card, Placeholder } from 'semantic-ui-react';

export default class CardPlaceholder extends Component {
    render() {  
        return (
            <Card fluid centered key={1}>
                <Card.Content>
                    <Placeholder>
                        <Placeholder.Header>
                        <Placeholder.Line length='very short' />
                        <Placeholder.Line length='medium' />
                        </Placeholder.Header>
                        <Placeholder.Paragraph>
                        <Placeholder.Line length='short' />
                        </Placeholder.Paragraph>
                    </Placeholder>
                </Card.Content>
        </Card>
        );
    }
}  



             
           