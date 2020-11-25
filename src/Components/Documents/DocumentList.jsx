import React, { useCallback, useState } from 'react';
import { 
    Icon,
    Pagination,
    Button,
    Accordion,
    List,
    Segment, 
    Header
 } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import DocumentItem from './DocumentItem';

export function DocumentList(props) {

    const [visible, setVisible] = useState(true);
    const { documents, onDelete, onDownload, onUpload } = props;

    const onDrop = useCallback((acceptedFiles) => {

        Array.from(acceptedFiles).forEach((file) => {
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                onUpload(file);
            }
            reader.readAsArrayBuffer(file)
        })
        
    }, [props]);
 
    const {getRootProps, getInputProps} = useDropzone({
        disabled: (documents ? documents.length>0 : false),
        onDrop
    });

    const fileInputRef = React.createRef();

    const grid = documents ? documents.map((document) => (
        <DocumentItem
            key={document.id}
            onDownload={onDownload}
            onDelete={onDelete}
            document={document}
        />
    )) : [];

    function filesChanged (e) {
        onDrop(e.target.files);
    };

    return (  
        <Accordion fluid styled style={{...props.style, height:'100%'}}>
          <Accordion.Title
            active={visible}
            onClick={() => setVisible(!visible)}
          >
            <Icon name='dropdown' />
            Documents
          </Accordion.Title>
          <Accordion.Content active={visible}>
            <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                onChange={filesChanged}
            />
            <div {...getRootProps()} style={{   height:'80%',
                                                paddingRight:"10px",
                                                paddingLeft: "10px",
                                                paddingTop:"10px", 
                                                paddingBottom:"10px",
                                                overflowY: 'scroll'}}>
                <input {...getInputProps()} />
                {documents && documents.length > 0 ? <List celled>{grid}</List> : (
                    <Segment placeholder>
                        <Header icon>
                        <Icon name='pdf file outline' />
                            Drag Documents Here or Click "Add Document(s)" to Upload
                        </Header>
                        <Button 
                            primary
                            onClick={() => fileInputRef.current.click()}
                        >
                            Add Document(s)
                        </Button>
                    </Segment>
                )}
            </div>
            <Pagination
                activePage={props.page}
                totalPages={props.pages}
                onPageChange={(event, data) => props.handleSelectDocumentPage(data.activePage)}
            />
          </Accordion.Content>
        </Accordion>
    );
}  