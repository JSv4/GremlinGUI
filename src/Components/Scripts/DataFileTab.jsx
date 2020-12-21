import React, { useCallback } from 'react';
import { 
    Icon,
    Button,
    Segment, 
    Header,
    List
 } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';

export function ManifestItem(props) {  

    const {name, uuid} = props;

    return (
        <List.Item key={uuid}>
            <List.Icon 
                name='file alternate'
                size='large'
                verticalAlign='middle'
            />
            <List.Content>
                    <List.Header>
                        {name}
                    </List.Header>
            </List.Content>
        </List.Item>
    );
}  

export function DataFileDropArea(props) {

    const { data_file, onUpload } = props;

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
        disabled: Boolean(data_file),
        onDrop
    });

    const fileInputRef = React.createRef();

    function filesChanged (e) {
        onDrop(e.target.files);
    };

    return (  
        <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={onUpload}
            />
            <Segment placeholder>
                <Header icon>
                <Icon name='pdf file outline' />
                    Drag .Zip of Data Files or Click "Add Document(s)" to Upload
                </Header>
                <Button 
                    primary
                    onClick={() => fileInputRef.current.click()}
                >
                    Add Data File
                </Button>
            </Segment>
        </div>
    );
}  

export function DataFileManifest(props) {

    const { data_file } = props;
    const content_list = data_file.manifest ? data_file.manifest.split("\n") : [""]
    const content = content_list.map((item) => <ManifestItem uuid={data_file.uuid ? data_file.uuid : "-1"} name={item}/>)
    
    return (
        <List celled>{content}</List>
    );

}