import React from 'react';
import { Placeholder } from 'semantic-ui-react';

function ParagraphPlaceholder(props) {
    return (
        <Placeholder>
            <Placeholder.Header image>
            <Placeholder.Line length='medium' />
            <Placeholder.Line length='full' />
            </Placeholder.Header>
            <Placeholder.Paragraph>
            <Placeholder.Line length='full' />
            <Placeholder.Line length='medium' />
            </Placeholder.Paragraph>
        </Placeholder>
    );
}

export default ParagraphPlaceholder;
