import React, { PureComponent } from 'react';
import ReactJson from 'react-json-view';

export default class JsonEditor extends PureComponent {

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
            jsonObj: this.props.jsonObj ? this.props.jsonObj : {}
        };
    }

    //This is the new React-favored way to handle state update on prop changes:
    //https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    //Old way would have been componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.jsonObj!==prevState.jsonObj){
            return { 
                jsonObj: nextProps.jsonObj
            };
        }
        else return null;
     }
    
    onChange = (newJobInputs) => {
        let updatedObj = {...this.props.job};
        updatedObj.job_inputs=JSON.stringify(newJobInputs);
        this.props.handleUpdateObj(updatedObj);
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

        return (
            <div key={this.props.selectedJob}>
                <ReactJson 
                    collapsed={collapsed}
                    style={style}
                    theme={theme}
                    src={this.state.jsonObj}
                    collapseStringsAfterLength={collapseStringsAfter}
                    onEdit={ !job.finished ? e => {
                                    let newSrc = e.updated_src;
                                    this.setState({jsonObj: newSrc});
                                    this.onChange(newSrc);
                                } : false
                    }
                    onDelete={ !job.finished ? e => {
                                    let newSrc = e.updated_src;
                                    this.setState({jsonObj: newSrc});
                                    this.onChange(newSrc);
                                } : false
                    }
                    onAdd={ !job.finished ? e => {
                                    let newSrc = e.updated_src;
                                    this.setState({jsonObj: newSrc});
                                    this.onChange(newSrc);
                                } : false
                    }
                    displayObjectSize={displayObjectSize}
                    enableClipboard={enableClipboard}
                    indentWidth={indentWidth}
                    displayDataTypes={displayDataTypes}
                    iconStyle={iconStyle}
                />
            </div>);
    }
}
