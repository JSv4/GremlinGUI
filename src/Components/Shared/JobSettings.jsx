import { Button, Segment } from 'semantic-ui-react';
import React, { PureComponent } from 'react';
import ReactJson from 'react-json-view';

export default class JobSettings extends PureComponent {

    static defaultProps = {
        theme: "bright:inverted",
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
        iconStyle: "triangle"
    }

    constructor(props) {
        super(props);
        this.state = {
            jobSettings: this.props.jobSettings ? this.props.jobSettings : {},
            jobSettingsStr: JSON.stringify()
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!this.props.job) return false;
        
        return (
            this.props.job.job_input_json!==nextProps.job.job_input_json
            &&
            this.state.jobSettingsStr!==nextProps.job.job_input_json
        );
    }

    componentDidUpdate() {
        console.log("JobSettings updated");
    }

    packageSettings = (newJobInputs) => {
        let updatedObj = {...this.props.job};
        
        // Need a more elegant solution here... but the serializer is not expecting pipeline obj yet it's included
        // in redux store for some requests. I know, I know, bad coding. Need to use this consistently in the future.
        if ('pipeline' in updatedObj) {
            delete updatedObj.pipeline;
        }
        
        updatedObj.job_input_json=newJobInputs;
        return updatedObj;
    }

    render() {

        const {
            collapseStringsAfter,
            displayObjectSize,
            enableClipboard,
            theme,
            iconStyle,
            collapsed,
            indentWidth,
            displayDataTypes,
            job
        } = this.props;

        const style = {
            padding: "10px",
            borderRadius: "3px",
            margin: "10px 0px"
        }

        console.log("Render JobSettings");

        return (
            <Segment>
                <div style={{textAlign:'right'}}>
                    <div>
                        <Button 
                            circular
                            icon='save'
                            color='blue'
                            onClick={() => this.props.handleUpdateJob(this.packageSettings(this.state.jobSettings))}
                        />
                    </div>
                </div>
                <ReactJson 
                    collapsed={collapsed}
                    style={style}
                    theme={theme}
                    src={this.state.jobSettings}
                    collapseStringsAfterLength={collapseStringsAfter}
                    onEdit={ job && !job.finished ? e => {
                                    let newSrc = e.updated_src;
                                    this.setState({jobSettings: newSrc});
                                } : false
                    }
                    onDelete={ job && !job.finished ? e => {
                                    let newSrc = e.updated_src;
                                    this.setState({jobSettings: newSrc});
                                } : false
                    }
                    onAdd={ job && !job.finished ? e => {
                                    let newSrc = e.updated_src;
                                    this.setState({jobSettings: newSrc});
                                } : false
                    }
                    displayObjectSize={displayObjectSize}
                    enableClipboard={enableClipboard}
                    indentWidth={indentWidth}
                    displayDataTypes={displayDataTypes}
                    iconStyle={iconStyle}
                />
            </Segment>);
    }
}
