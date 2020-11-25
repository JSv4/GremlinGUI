import React from 'react';
import {
    Segment,
    Dimmer,
    Loader
} from 'semantic-ui-react';
import JsonViewer from './JsonViewer';
import PythonViewer from './PythonViewer';
import ReadOnlyDocumentList from '../Documents/ReadOnlyDocumentList';

export function NodeInputTab(props) {
    
    const {
        raw_input_data,
        transform_script,
        transformed_input_data,
        loading_text,
        input_data_label,
        transform_script_label,
        transformed_input_data_label,
        style
    } = props;

    return (
        <>
            <Dimmer active={loading_text} inverted>
                <Loader size='tiny' inverted>{loading_text}</Loader>
            </Dimmer>
            <Segment.Group style={style}>
                <JsonViewer 
                    title={ input_data_label ? input_data_label : "Raw Input Data"}
                    jsonObj={raw_input_data}
                />
                <PythonViewer
                    title={ transform_script_label ? transform_script_label : "Input Data Transform Script" }
                    code={transform_script}
                />
                <JsonViewer
                    title= { transformed_input_data_label ? transformed_input_data_label : "Transformed Input Data"}
                    jsonObj={transformed_input_data}
                />
            </Segment.Group> 
        </>
    );
}

export function NodeOutputTab(props) {

    const {
        output_data,
        loading_text,
        style
    } = props;

    return (
        <>
            <Dimmer active={loading_text} inverted>
                <Loader size='tiny' inverted>{loading_text}</Loader>
            </Dimmer>
            <JsonViewer
                style={style}
                title="Resulting Data"
                jsonObj={output_data}
            />
        </>
    );
}

export function JobDocumentReadOnlyTab(props) {

    const {
        documents,
        selectedPage, 
        pageCount, 
        handleDownloadDocument,
        handleChangePage
    } = props;

    return ( 
        <ReadOnlyDocumentList
            documents={documents}
            selectedPage={selectedPage}
            pages={pageCount}
            onDownload={handleDownloadDocument}
            handleChangePage={handleChangePage} 
        />
    );
}

export function JobInputReadOnlyTab(props) {
    return (
        <JsonViewer jsonObj={props.input_data}/>
    );
}