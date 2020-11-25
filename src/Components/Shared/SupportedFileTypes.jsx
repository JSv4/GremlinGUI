import React from 'react'
import { Label } from 'semantic-ui-react'

const SupportedFileTypes = (props) => {
    let labels = <></>;
    if (props.extensions.length > 0) {
        labels = props.extensions.map(ext => <Label color='grey' key={`${ext}`} size='tiny'>{ext}</Label>);
    }
    else{
        labels = [<Label key='Nothing' color='yellow' size='tiny'>No File Type Restrictions</Label>];
    }
    return (
    <div style={{padding:'5px'}}>
        {labels}
    </div>);
}

export default SupportedFileTypes;