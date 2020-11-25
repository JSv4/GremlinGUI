import React, { useState } from 'react';
import { Segment, Button, Comment, Input, Icon, Label } from 'semantic-ui-react';
import { EmptyListItem, NodeListItem } from './NodeListItem';
import { NewNodeNameModel } from '../Modals/NewNodeNameModal';

import Fuse from 'fuse.js';

const SelectWindow = (props) => {
    const { scripts, setAddModalVisible } = props;
    const [showNewNameView, setShowNewNameView] = useState(false); 
    const [selectedNode, selectNode] = useState(-1);
    const [searchString, setSearchString] = useState("");
    const [newName, setNewName] = useState("");


    const scriptFuse = new Fuse(scripts, {
        threshold: 0.4,
        keys: ['human_name', 'description']
    });

    const filteredScripts = searchString ==="" ? scripts : scriptFuse.search(searchString).map((item) => item.item); 

    const items = filteredScripts.length > 0 ? filteredScripts.map((script) => (
        <NodeListItem
            key={script.id}
            script={script}
            selected={selectedNode === script.id}
            onSelect={selectNode}
        />
    )) : <EmptyListItem/> ;

    function handleChange(e) {
        setSearchString(e.target.value);
    };

    function saveAndClose(nodeName, scriptId, settings) {
        props.onAddNode(nodeName, scriptId, settings);
        setAddModalVisible(false);
    }

    return (
        <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
            {
                !showNewNameView ? 
                    <>
                        <Segment style={{width:'100%', margin:'0px'}}>
                            <Input
                                style={{width:'100%'}}
                                placeholder='Search...'
                                name='searchString'
                                icon='search'
                                value={searchString}
                                onChange={handleChange}
                            />
                        </Segment>
                        <Segment>
                            <Comment.Group style={{
                                height:'30vh',
                                overflowY: 'scroll',
                            }}>
                                {items}
                            </Comment.Group>
                        </Segment>
                        <div>
                            <Button
                                disabled={selectedNode===-1}
                                floated='right'
                                positive
                                onClick={() => setShowNewNameView(!showNewNameView)}
                            >
                                Add Node
                            </Button>
                        </div>
                    </>
                    :
                    <>
                        <Segment padded>
                            <Label attached='top'>Pipeline name:</Label>
                            <Input
                                fluid
                                value={newName}
                                onChange = {(data) => { setNewName(`${data.target.value}`)}}
                            />
                        </Segment>
                        <div>
                            <Button color='green' onClick={() => saveAndClose(newName, selectedNode, {})}>
                                <Icon name='checkmark' /> Create Node
                            </Button>
                            <Button color='grey' onClick={() => setShowNewNameView(false)}>
                                <Icon name='cancel' /> Cancel
                            </Button>
                        </div>
                    </>
            }
        </div> 
    );
};

export default SelectWindow;
