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
        return (
            this.props.job.job_inputs!==nextProps.job.job_inputs
            &&
            this.state.jobSettingsStr!==nextProps.job.job_inputs
        );
    }

    componentDidUpdate() {
        console.log("JobSettings updated");
    }

    packageSettings = (newJobInputs) => {
        let updatedObj = {...this.props.job};
        updatedObj.job_inputs=JSON.stringify(newJobInputs);
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
                    onEdit={ !job.finished ? e => {
                                    let newSrc = e.updated_src;
                                    this.setState({jobSettings: newSrc});
                                } : false
                    }
                    onDelete={ !job.finished ? e => {
                                    let newSrc = e.updated_src;
                                    this.setState({jobSettings: newSrc});
                                } : false
                    }
                    onAdd={ !job.finished ? e => {
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
