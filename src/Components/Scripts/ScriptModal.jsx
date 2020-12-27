import React, { Component } from 'react'
import { Header, 
    Button, 
    Modal, 
    Dimmer, 
    Loader, 
    Form,
    Input,
    TextArea,
    Segment,
    Dropdown,
    Label,
    Icon,
    Menu } from 'semantic-ui-react'
import AceEditor from "react-ace";
import ReactJson from 'react-json-view';
import Ajv from 'ajv';
import { LazyLog } from 'react-lazylog';

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/mode-python";
import "ace-builds/src-min-noconflict/theme-solarized_dark";
import 'ace-builds';
import "ace-builds/webpack-resolver";

import { DataFileDropArea, DataFileManifest } from './DataFileTab';
import ConfirmModal from '../Shared/ConfirmModal';
import { InputResultTabs } from '../Layouts/Layouts';

const fileTypeSchema = {
    $schema: "http://json-schema.org/draft-07/schema",
    $id: "http://example.com/example.json",
    type: "object",
    title: "The File Extension Type Schema",
    default: {doc_types: [".pdf"]},
    additionalProperties: true,
    required: [
        "doc_types"
    ],
    properties: {
        doc_types: {
            $id: "#/properties/doc_types",
            type: "array",
            title: "The Doc_types Schema",
            description: "This is an array of all supported file type extensions for this script.",
            default: [],
            examples: [
                [
                    ".doc",
                    ".pdf"
                ]
            ],
            additionalItems: true,
            items: {
                $id: "#/properties/doc_types/items",
                type: [
                    "string",
                    "null"
                ],
                title: "Doc file type item schema",
                description: "Each item in the array is a file extension of a supported file type.",
                default: "",
                examples: [
                    ".doc",
                    ".pdf"
                ],
                minimum: 1.0,
                pattern: "^\\.[a-zA-Z0-9]+$"
            }
        }
    }
};

export default class ScriptModal extends Component {
    
    static defaultProps = {
        theme: "monokai",
        src: null,
        collapsed: false,
        collapseStringsAfter: 15,
        onAdd: true,
        onEdit: true,
        onDelete: true,
        displayObjectSize: true,
        enableClipboard: true,
        indentWidth: 4,
        displayDataTypes: true,
        iconStyle: "triangle", 
        timer: null
    };

    constructor(props) {
        super(props);
        this.state = {
            serverScriptObj: this.props.selectedScriptData ? this.props.selectedScriptData : null,
            localScriptObj: this.props.selectedScriptData ? this.props.selectedScriptData : null,
            settings: {},
            showCodeEditor: true,
            showJobMeta: false,
            showDescriptionEditor: false,
            showPackageEditor: false,
            showSetupScriptEditor: false,
            showSettings: false,
            showSetupLog: false,
            jsonEditorCollapsed: true,
            showConfirmModal: false,
            showDeleteModal: false,
            showFileTypes: false,
            modalTab:0
        };
    }

    setSelectedTab = (modalTab) => {
        this.setState({
            modalTab 
        });
    }

    //This is the new React-favored way to handle state update on prop changes:
    //https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    //Old way would have been componentWillReceiveProps. This is disfavored approach BTW, TODO - change.
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.selectedScriptData!==prevState.serverScriptObj){
            return { 
                serverScriptObj: nextProps.selectedScriptData,
                localScriptObj: nextProps.selectedScriptData
            };
        }
        else return null;
     }

    toggleConfirmModal = () => {
        this.setState({
            showConfirmModal: !this.state.showConfirmModal
        });
    }

    toggleDeleteModal = () => {
        this.setState({
            showDeleteModal: !this.state.showDeleteModal
        });
    }

    onConfirmSave = (obj) => {
        console.log("onConfirmSave", obj);
        this.props.handleUpdateScript(obj);
    }

    onConfirmDelete = () => {
        this.props.handleDeleteScript(this.state.localScriptObj.id);
        this.props.handleClearScript();
        this.props.handleScriptModalToggle();
    }

    onDescriptionChange = (value) => {
        let updatedScriptObj = {...this.state.localScriptObj};
        updatedScriptObj.description = value;
        this.setState({
            localScriptObj: updatedScriptObj
        });
    }

    onToggleMode = () => {
        let updatedScriptObj = {...this.state.localScriptObj};
        updatedScriptObj.mode = updatedScriptObj.mode === 'TEST' ? 'DEPLOYED' : 'TEST';
        this.setState({
            localScriptObj: updatedScriptObj
        });
    }

    onPackageListChange = (value) => {
        let updatedScriptObj = {...this.state.localScriptObj};
        updatedScriptObj.required_packages = value;
        this.setState({
            localScriptObj: updatedScriptObj
        });
    }

    onSetupScriptChange = (value) => {
        let updatedScriptObj = {...this.state.localScriptObj};
        updatedScriptObj.setup_script = value;
        this.setState({
            localScriptObj: updatedScriptObj
        });
    }

    onNameChange = (newName) => {
        let newScriptObj = {...this.state.localScriptObj};
        newScriptObj.human_name = newName;
        newScriptObj.name = newName.replace(" ","_").toUpperCase();
        this.setState({
            localScriptObj:  newScriptObj
        });
    }

    onSchemaChange = (newInputObj) => {
        let newScriptObj = {...this.state.localScriptObj};
        newScriptObj.required_inputs = JSON.stringify(newInputObj);
        this.setState({
            localScriptObj:  newScriptObj
        });
    }

    // If the user tries to edit supported file types... check the edit conforms to schema. 
    // If the edit doesn't conform, throw it away. If it does conform, store in local state. 
    onFileTypeChange = (newFileType) => {
        var ajv = new Ajv();
        var valid = ajv.validate(fileTypeSchema, {doc_types: newFileType});
        if (!valid){
            return false; //returning false will tell react-json-view to throw a validation error and not update.
        }
        else {
            let newScriptObj = {...this.state.localScriptObj};
            newScriptObj.supported_file_types = JSON.stringify(newFileType);
            this.setState({
                localScriptObj:  newScriptObj
            });
            return true;
        }    
    }

    onTypeChange = (newType) => {
        let newScriptObj = {...this.state.localScriptObj};
        newScriptObj.type = newType;
        this.setState({
            localScriptObj:  newScriptObj
        });
    }

    onScriptChange = (newValue) => {
        let newScriptObj = {...this.state.localScriptObj};
        newScriptObj.script = newValue;
        this.setState({
            localScriptObj:  newScriptObj
        });
      }

    // Once this component mounts, periodically update the script data.
    componentDidMount() {

        let timer = setInterval(this.tick, 2000);
        this.setState({timer});

    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    // Refresh ever X seconds
    tick = () => {
        if(this.props.selectedScriptData) {
            // If serverScriptObj is locked... refresh
            if (this.props.loading || this.props.selectedScriptData.locked) {
                console.log("Scripts are loading or current script is locked... try to refetch");
                this.props.handleRefreshScript(this.props.selectedScriptData.id)
            }
            else
            {
                console.log("Scripts are not loading and this script isn't locked... nothing to update");
            }
        }  
    }


    uploadDataArchive = (event) => {
        if (this.props.selectedScriptData) {
            event.preventDefault();
            console.log(event.target.files[0]);
            this.props.handleUploadScriptData(this.props.selectedScriptData.id, event.target.files[0]);
        }
    }

    render() {

        const fileInputRef = React.createRef();

        const {
            collapseStringsAfter,
            displayObjectSize,
            enableClipboard,
            theme,
            iconStyle,
            indentWidth,
            displayDataTypes,
            selectedScriptData,
            loading,
            windowHeight
        } = this.props;

        const style = {
            padding: "10px",
            borderRadius: "3px",
            margin: "10px 0px"
        }

        function LoadingIndicator() {
            
            let text = "";
            if (loading) text = "Scripts Are Loading...";
            else if (selectedScriptData && selectedScriptData.locked) text = "Script is Being Setup...";

            return (
                text? <Dimmer active>
                    <Loader>{text}</Loader>
                </Dimmer> : <></>
            );
            
        }

        // If no selectedScriptData, nothing to render and return empty component
        if (!selectedScriptData) return <div></div>;

        // Parse the script input schema from the string stored in the db
        let schemaJson = {};
        try {
            schemaJson = JSON.parse(this.state.localScriptObj.required_inputs);
        } catch (e) {
            schemaJson = {};
        }
        
        // Parse the file type json from the string stored in the db
        let fileTypesJson = {};
        try {
            fileTypesJson = JSON.parse(this.state.localScriptObj.supported_file_types);
        } catch (e) {
            fileTypesJson = {};
        }

        // Script settings panes for rendering
        const panes = [
            (<>
                {this.props.detailsAreFetching ? <Dimmer active><Loader>Loading</Loader></Dimmer> : <></>}
                <AceEditor
                    style={{width: '100%', height:'100%', maxHeight: '100%'}}
                    mode="python"
                    theme="solarized_dark"
                    name="code_editor"
                    onChange={this.onScriptChange}
                    fontSize={10}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={this.state.localScriptObj.script}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        useSoftTabs: true,
                        showLineNumbers: true,
                        tabSize: 4,
                    }}/>
            </>),
            (<>
                <Segment>
                    <Label attached='top'>Name and Type</Label>
                    <Input
                        style={{width:'100%'}}
                        name='pipelineName'
                        value={this.state.localScriptObj.human_name}
                        onChange = {(data) => { this.onNameChange(data.target.value)}}
                    />
                     <Dropdown
                        options={[{key:1, text:'Run Once Per Job', value:'RUN_ON_JOB'},{key:2, text:'Run Once Per Doc', value:'RUN_ON_JOB_DOCS_PARALLEL'}]}
                        selection
                        onChange={
                            (e, data) => {
                                this.onTypeChange(data.value);
                            }
                        }
                        value={this.state.localScriptObj.type}
                    />
                </Segment>
                <Segment>
                    <Label attached='top'>Description</Label>
                        <TextArea
                            style={{width:'100%'}}
                            rows={4}
                            value={this.state.localScriptObj ? this.state.localScriptObj.description : ""}
                            onChange={(e) => this.onDescriptionChange(e.target.value)}/>
                </Segment>
            </>),
            (<ReactJson 
                collapsed={this.state.jsonEditorCollapsed}
                style={style}
                theme={theme}
                src={schemaJson}
                collapseStringsAfterLength={collapseStringsAfter}
                onEdit={ e => {
                                this.onSchemaChange(e.updated_src);
                            }
                }
                onDelete={ e => {
                                this.onSchemaChange(e.updated_src);
                            }
                }
                onAdd={ e => {
                                this.onSchemaChange(e.updated_src);
                            }
                }
                displayObjectSize={displayObjectSize}
                enableClipboard={enableClipboard}
                indentWidth={indentWidth}
                displayDataTypes={displayDataTypes}
                iconStyle={iconStyle}
            />),
            (<ReactJson 
                collapsed={this.state.jsonEditorCollapsed}
                style={style}
                theme={theme}
                src={fileTypesJson}
                collapseStringsAfterLength={collapseStringsAfter}
                onEdit={ e => {
                                return this.onFileTypeChange(e.updated_src);
                            }
                }
                onDelete={ e => {
                                return this.onFileTypeChange(e.updated_src);
                            }
                }
                onAdd={ e => {
                                return this.onFileTypeChange(e.updated_src);
                            }
                }
                displayObjectSize={displayObjectSize}
                enableClipboard={enableClipboard}
                indentWidth={indentWidth}
                displayDataTypes={displayDataTypes}
                iconStyle={iconStyle}
            />),
            (<InputResultTabs
                panelOne={<>
                    <Label attached='top'>Setup Script</Label>
                    <Form>
                        <TextArea
                            rows={12}
                            value={this.state.localScriptObj ? this.state.localScriptObj.setup_script : ""}
                            onChange={(e) => this.onSetupScriptChange(e.target.value)}
                            style={{height:'40vh'}}/>
                    </Form> 
                </>}
                panelOneLabel="Installer Script"
                panelTwo={<>
                    <Label attached='top'>Setup Script Logs:</Label>
                    <LazyLog 
                        extraLines={1}
                        enableSearch
                        text={this.props.selectedScriptData && this.props.selectedScriptData.setup_log === "" ? "Log is empty" : this.props.selectedScriptData.setup_log}
                        height={windowHeight*.4}
                        follow
                        caseInsensitive
                    />
                </>}
                panelTwoLabel="Installer Results"
            />),
             (<InputResultTabs 
                    panelOne={<>
                        <Label attached='top'>Required Python Packages</Label>
                        <Form>
                            <TextArea
                                rows={12}
                                value={this.state.localScriptObj ? this.state.localScriptObj.required_packages : ""}
                                onChange={(e) => this.onPackageListChange(e.target.value)}
                                style={{height:'40vh'}}/>
                        </Form> 
                    </>}
                    panelOneLabel="Package List"
                    panelTwo={<>
                        <Label attached='top'>Package Installation Logs:</Label>
                            <LazyLog 
                                extraLines={1}
                                enableSearch
                                text={this.props.selectedScriptData && this.props.selectedScriptData.installer_log === "" ? "Log is empty" : this.props.selectedScriptData.installer_log}
                                height={windowHeight*.4}
                                follow
                                caseInsensitive />
                    </>}
                    panelTwoLabel="Install Log"
                />),
                (<>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', height:'100%'}}>
                        <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', width:'100%'}}>
                            {this.state.localScriptObj.data_file ?
                                <Segment raised style={{width:'100%', marginBottom:'1vh'}}>
                                     <Header as='h2'>
                                        <Icon name='database' />
                                        <Header.Content>
                                        Script Data File
                                        <Header.Subheader>Contents of uploaded data file (.zip files only).</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                    <DataFileManifest data_file={this.state.localScriptObj.data_file}/>
                                    <Button color='red' animated='vertical' onClick={() => this.props.handleDeleteScriptData(this.state.localScriptObj.id)}>
                                        <Button.Content hidden>Data</Button.Content>
                                        <Button.Content visible>
                                            Delete <Icon name='trash' />
                                        </Button.Content>
                                    </Button>
                                </Segment>
                                :
                                <>
                                    <DataFileDropArea
                                        onUpload={this.uploadDataArchive}
                                    />
                                </>
                            }
                        </div>
                    </div>   
                </>),
                (<>
                <Segment style={{marginBottom:'1vh'}}>
                    <Label attached='top'>Script Status</Label> 
                </Segment>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%'}}>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', width:'100%'}}>
                        {this.state.localScriptObj.install_error ?
                            <Segment raised style={{width:'100%'}}>
                                <Label attached='top'>Installation Error:</Label>
                                <LazyLog 
                                    extraLines={1}
                                    enableSearch
                                    text={this.state.localScriptObj.install_error_code}
                                    height={windowHeight/3}
                                    follow
                                    caseInsensitive />
                            </Segment> :
                                <Segment style={{width: '30vw', height:'30vh', margin:'1vh'}} raised>
                                <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                    <div style={{marginBottom:'1vh'}}>
                                        <Icon name='thumbs up outline'color='green' size='massive'/>
                                    </div>
                                    <div>
                                        <Header as='h1' textAlign='center'>
                                            INSTALLED
                                            <Header.Subheader>
                                            No Issues
                                            </Header.Subheader>
                                        </Header>
                                    </div>
                                </div>
                            </Segment>
                        }
                    </div>
                </div>
            </>)
          ]

        return (
            <Modal 
                size='fullscreen'
                open={this.props.visible}
                onOpen={() => this.onModalOpen()}
                style={{height:'95%', maxHeight:'95%', display:'flex', flexDirection:'column', justifyContent:'flex-start'}}
            >
                <ConfirmModal
                    visible={this.state.showConfirmModal} 
                    message="You have selected save on a script. ARE YOU SURE? This cannot be undone and incorrect changes may cause errors and unwanted results."
                    yesAction={() => this.onConfirmSave(this.state.localScriptObj)}
                    noAction={this.toggleConfirmModal}
                    toggleModal={this.toggleConfirmModal}
                />
                <ConfirmModal
                    visible={this.state.showDeleteModal} 
                    message="You have chosen to delete this script. ARE YOU SURE? This cannot be undone and any dependent pipelines and settings will be lost."
                    yesAction={() => this.onConfirmDelete()}
                    noAction={this.toggleDeleteModal}
                    toggleModal={this.toggleDeleteModal}
                />
                <Label 
                    corner='right'
                    color='grey'
                    icon='cancel'
                    onClick={()=> this.props.handleScriptModalToggle()}
                />
                <Header icon='archive' content={`Edit Script: ${this.state.localScriptObj ? this.state.localScriptObj.human_name : ""}`}/>
                <Modal.Content style={{flex:10, height:'90%'}}>
                    <div>
                        <LoadingIndicator/>
                        <Segment >
                            <Button circular icon='save' color='green' onClick={() => this.toggleConfirmModal()}/>
                            <Button circular icon='trash' color='red' onClick={() => this.toggleDeleteModal()}/>
                            <Button 
                                floated='right'
                                toggle
                                active={this.state.localScriptObj.mode==='DEPLOYED'}
                                onClick={this.onToggleMode}
                                color={this.state.localScriptObj.mode==='DEPLOYED' ? 'green' : 'red'}
                            >
                                {this.state.localScriptObj.mode==='DEPLOYED' ? 'In Production' : 'Testing Mode'}
                            </Button>
                        </Segment>
                        <Segment style={{width:'100%', height:'90%'}}>
                            <div style={{ display:'flex', flexDirection:'row', justifyContent:'flex-start', height:'100%', width:'100%' }}>
                                <div style={{height:'100%'}}>
                                    <Menu icon='labeled' vertical>
                                        <Menu.Item
                                            name='pythoncode'
                                            active={this.state.modalTab === 0}
                                            onClick={() => this.setSelectedTab(0)}
                                        >
                                            <Icon name='code' />
                                            Python Code
                                        </Menu.Item>

                                        <Menu.Item
                                            name='scriptmeta'
                                            active={this.state.modalTab === 1}
                                            onClick={() => this.setSelectedTab(1)}
                                        >
                                            <Icon name='settings' />
                                            Settings
                                        </Menu.Item>

                                        <Menu.Item
                                            name='inputschema'
                                            active={this.state.modalTab === 2}
                                            onClick={() => this.setSelectedTab(2)}
                                        >
                                            <Icon name='table' />
                                            Input Schema
                                        </Menu.Item>

                                        <Menu.Item
                                            name='filetypes'
                                            active={this.state.modalTab === 3}
                                            onClick={() => this.setSelectedTab(3)}
                                        >
                                            <Icon name='file alternate outline' />
                                            Filetypes
                                        </Menu.Item>

                                        <Menu.Item
                                            name='installers'
                                            active={this.state.modalTab === 4}
                                            onClick={() => this.setSelectedTab(4)}
                                        >
                                            <Icon name='paper plane outline' />
                                            Installers
                                        </Menu.Item>

                                        <Menu.Item
                                            name='packages'
                                            active={this.state.modalTab === 5}
                                            onClick={() => this.setSelectedTab(5)}
                                        >
                                            <Icon name='box' />
                                            Python Packages
                                        </Menu.Item>

                                        <Menu.Item
                                            name='data_file'
                                            active={this.state.modalTab === 6}
                                            onClick={() => this.setSelectedTab(6)}
                                        >
                                            <Icon name={this.state.localScriptObj.data_file ? "file archive" : "file archive outline"}/>
                                            Data File
                                        </Menu.Item>

                                        <Menu.Item
                                            name='status'
                                            active={this.state.modalTab === 7}
                                            onClick={() => this.setSelectedTab(7)}
                                        >
                                            <Icon name={this.state.localScriptObj.install_error ? 
                                                "warning sign" : "thumbs up outline"}
                                                color={this.state.localScriptObj.install_error ? 
                                                "red" : "green"}/>
                                            Status
                                        </Menu.Item>
                                    </Menu>
                                </div>
                                <div style={{flexGrow:10}}>
                                    <Segment style={{width: '100%', height:'100%'}}>
                                        {panes[this.state.modalTab]}
                                    </Segment>
                                </div>
                            </div> 
                        </Segment>
                    </div>
                </Modal.Content>
            </Modal>          
        );
    }
}

