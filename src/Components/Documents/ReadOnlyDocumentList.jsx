import React, { useState } from 'react';
import { 
    List,
    Icon,
    Pagination,
    Segment,
    Accordion
} from 'semantic-ui-react';

function ReadOnlyDocumentList(props) {

    const [visible, setVisible] = useState(true);
    const { 
        documents, 
        pages, 
        selectedPage, 
        onDownload, 
        handleChangePage } = props;

    const items = documents ? documents.map((doc) => (
        <List.Item key={doc.id}>
            <List.Icon 
                name='file alternate'
                size='large'
                verticalAlign='middle'
            />
            <List.Content>
            <List.Header as='a' onClick={() => onDownload(doc.id)}>{doc.name}</List.Header>
            <List.Description>ID: {doc.id} | Extracted: {`${doc.extracted}`}</List.Description>
            </List.Content>
        </List.Item>
    )) : [];

    function PageChangeIntrospector(selectedPage) {
        console.log("Change page to ", selectedPage);
        handleChangePage(selectedPage.activePage);
    }

    return (  
        <Accordion fluid styled style={{...props.style}}>
          <Accordion.Title
            active={visible}
            onClick={() => setVisible(!visible)}
          >
            <Icon name='dropdown' />
            Documents
          </Accordion.Title>
          <Accordion.Content active={visible}>
            <Segment>
                <List divided relaxed>     
                    { documents && documents.length !==0 ? items : (
                        <List.Item key={0}>
                            <List.Icon name='circle outline' color='red' verticalAlign='middle' />
                            <List.Content>
                            <List.Header as='a'>No Documents</List.Header>
                            <List.Description as='a'>This Job Has No Documents...</List.Description>
                            </List.Content>
                        </List.Item>
                    )}
                </List>
            </Segment>
            <Pagination
                activePage={selectedPage}
                onPageChange={(e, data) => PageChangeIntrospector(data)} 
                totalPages={pages}
            />
          </Accordion.Content>
        </Accordion>
    );
}  

export default ReadOnlyDocumentList;