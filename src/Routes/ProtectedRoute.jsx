import React from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = this.props.auth.loggedIn;
       
        return isAuthenticated ? (
            <Component />
        ) : (
            <Redirect to={{ pathname: '/login' }} />
        );
    }
}

function mapStateToProps(state) {

    const {
      application,
      auth 
    } = state;
  
    return {
      application,
      auth
    }
  }
  
export default connect(mapStateToProps)(ProtectedRoute);