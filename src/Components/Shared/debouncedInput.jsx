import React, { Component } from 'react'
import debounce from 'lodash/debounce'

//based on the component code provided here: https://gist.github.com/laytong/e2aeecf32283c3a1ab6edf8e38a78903
export default function debouncedInput(WrappedComponent, config = { timeout: 500 }) {
  return class DebouncedTextArea extends Component {
    constructor(props) {
      super(props)
      this.state = {
        value: this.props.value,
      }
      this.sendTextChange = debounce(this.sendTextChange, config.timeout)
    }

    handleTextChange = (e) => {
      this.setState({value: e.target.value});
      this.sendTextChange({ target: { value: e.target.value } })
    };

    sendTextChange = (e) => {
      this.props.onChange(e.target.value);
    }

    //This is the new React-favored way to handle state update on prop changes:
    //https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    //Old way would have been componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState){
      if(nextProps.value!==prevState.value){
          return { 
              value: nextProps.value
          };
      }
      else return null;
   }

    render() {
      return (
        <WrappedComponent {...this.props} value={this.state.value} onChange={this.handleTextChange.bind(this)} />
      )
    }
  }
}