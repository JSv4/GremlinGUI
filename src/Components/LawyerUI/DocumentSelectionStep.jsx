import React from 'react';
import { 
    Segment
} from 'semantic-ui-react';
import { DocumentList } from '../Documents/DocumentList';

export const DocumentSelectionStep = (props) => {
    
    const {documents, onDelete, onUpload, onDownload} = props;

    return (
        <Segment style={{width:'100%', height:'100%', backgroundColor:'#f3f4f5'}}>
            <DocumentList
                documents={documents.items}
                page={documents.selectedPage}
                pages={documents.pages}
                onDelete={onDelete}
                onDownload={onDownload}
                onUpload={onUpload}
                handleSelectDocumentPage={props.handleSelectDocumentPage}
            />
        </Segment>
    );
}