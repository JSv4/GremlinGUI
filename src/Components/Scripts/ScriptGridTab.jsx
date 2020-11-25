import React, { Component } from 'react'
import _ from 'lodash';
import Fuse from 'fuse.js';

import { VerticallyCenteredDiv } from '../Shared/Wrappers';
import {truncator} from '../../Utils/maths';
import ScriptRow from './ScriptRow';
import { CreateAndSearchBar } from '../Shared/Controls';
import { ScriptTable } from './ScriptTable';

export default class ScriptGridTab extends Component {

    getPipelineStepsForPipeline = (pipelineId) => {
        return _.filter(this.props.pipelinesteps.items,{ pipeline: pipelineId })
    }

    getScriptsForPipelines = (pipelinesteps) => {
        return pipelinesteps.map((step) => {
            return _.find(this.props.scripts.items, {id:step.script})
        })
    }

    uploadScriptArchive = (event) => {
        event.preventDefault();
        console.log(event.target.files[0]);
        this.props.handleUploadScript(event.target.files[0]);
    }

    render() {

        const fileInputRef = React.createRef();

        let wholeNumberRows = truncator(this.props.pipelines.length/4,0);
        if (this.props.pipelines.length/4 > wholeNumberRows) wholeNumberRows++; 

        const scripts = this.props.scripts.items ? this.props.scripts.items : [];
        const { nameFilterValue } = this.props;
        const scriptFuse = new Fuse(scripts, {
            threshold: 0.4,
            keys: ['human_name', 'description']
        });
        const filteredScripts = nameFilterValue ==="" ? scripts : scriptFuse.search(nameFilterValue ).map((item) => item.item);    

        let rows = [];

        for (let count = 0; count < filteredScripts.length; count++) {
            rows.push(<ScriptRow 
                key={filteredScripts[count].id}
                onClick={() => this.props.handleScriptSelect(filteredScripts[count].id)}
                script={filteredScripts[count]}
                selected={filteredScripts[count].id===this.props.scripts.selectedScriptId}
                toggleEditModal={this.props.handleScriptModalToggle}
                onDelete={this.props.handleDeleteScript}
                onDownload={this.props.handleDownloadScript}
                />);
        }

        return (
            <VerticallyCenteredDiv>
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={this.uploadScriptArchive}
                />
                <CreateAndSearchBar
                    onChange={this.props.handleChangeScriptNameFilter}
                    onCreate={this.props.handleNewScriptModalToggle}
                    onSubmit={(data)=> {}} 
                    onImport={() => fileInputRef.current.click()}
                    placeholder='Search for script...'
                    value={nameFilterValue} 
                />
                <ScriptTable loading={this.props.scripts.loading}>
                    {rows}
                </ScriptTable>
            </VerticallyCenteredDiv>      
        );
    }
}