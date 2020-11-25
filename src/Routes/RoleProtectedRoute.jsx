import React from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

class RoleProtectedRoute extends React.Component {

    render() {
        const {componentOptions} = this.props;
        const {role} = this.props.auth.user;
        const {loggedIn} = this.props.auth;

        console.log("Role Protected Route: ", this.props);
        
        let Component = componentOptions[role];
       
        return loggedIn ? (
            <Component {...this.props}/>
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
  
export default connect(mapStateToProps)(RoleProtectedRoute);