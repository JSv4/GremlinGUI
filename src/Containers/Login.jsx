import React, { Component } from 'react';
import { Button, Form, Header, Image, Message, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  tryLogin, 
  tryLogout,
  getUserDetails,
  recoverUsername,
  resetPassword
} from '../Redux/auth_actions';

import {
  unselectJob
} from '../Redux/job_actions';

import {
  clearSelectedPipelineNode,
} from '../Redux/node_actions';

import {
  clearPipelines,
  unselectPipeline,
} from '../Redux/pipeline_actions';

import {
  clearDocuments,
  clearResults,
  clearStats,
} from '../Redux/actions';

import RecoverAccountModal from '../Components/Users/RecoverAccountModal';

const backgroundImage = require('../assets/background2.jpg');
const divStyle = {
  width: '100vw',
  height: '102vh',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover'
};


class Login extends Component {

  // Try login with provider username and password
  handleLoginClick = (username, password) => {
    this.props.dispatch(tryLogin(username, password)).then((loggedIn) => {
      if(loggedIn) {
        this.props.dispatch(getUserDetails()).then((fetchedUserDetails) => {
          if (fetchedUserDetails) {
            this.props.history.push("/home");
          }
          else{
            this.handleLogout();
          }
        });
      }
    });
  }

  handleRecoverUsername = (email) => {
    this.props.dispatch(recoverUsername(email));
  }

  handleResetPassword = (username) => {
    this.props.dispatch(resetPassword(username));
  }

  constructor(props) {
    super(props);
    this.state = {
        userNameValue: "Username...",
        passwordValue: "Password...",
        showRecoveryModal: false
    };
  }

  clear = () => {
    this.setState(
        {
            userNameValue: "Username...",
            passwordValue: "Password..."
        }
    );
  }

  handleKeyPress = (e) => {
    if (e.charCode === 13) {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault()
      this.tryLogin();
    }
  }

  toggleRecoveryModal = () => {
    this.setState({
      showRecoveryModal: !this.state.showRecoveryModal
    });
  }

  tryLogin = () => {
    this.handleLoginClick(this.state.userNameValue, this.state.passwordValue);
    this.clear();
  }

  handleLogout = () => {
    Promise.all([
      this.props.dispatch(clearDocuments()),
      this.props.dispatch(clearResults()),
      this.props.dispatch(clearPipelines()),
      this.props.dispatch(clearSelectedPipelineNode()),
      this.props.dispatch(clearStats()),
      this.props.dispatch(unselectJob()),
      this.props.dispatch(unselectPipeline())
    ]).then(() => {
      this.props.dispatch(tryLogout());
    });
  }

  render() {

    return (
      <div style={divStyle} >
        <RecoverAccountModal
          toggle={this.toggleRecoveryModal}
          visible={this.state.showRecoveryModal}
          handleRecoverUsername={this.handleRecoverUsername}
          handleResetPassword={this.handleResetPassword}
        />
        <div style={{ 
          display:'flex', 
          flexDirection:'column',
          justifyContent:'center', 
          alignItems: 'center',
          alignContent: 'center',
          height: '100%'
        }}>
          <div style={{ 
            display:'flex', 
            flexDirection:'row',
            justifyContent:'center',
            width:'100%',
            marginBottom:'1vh'
          }}>
            <div style={{
              flex:'column',
              textAlign: 'right',
              justifyContent:'center',
              marginLeft:'10%',
              height: '10%',
              bottomPadding:'1vh'
            }}>
              <Image style={{maxHeight:'100px', height:'10vh'}} src='/gremlin_128.png'/>
            </div>
            <div style={{
              flex:'column',
              textAlign: 'left',
              alignSelf:'center',
              alignItems:'center',
              alignContent:'center',
              justifyContent:'center',
              height:'auto',
              marginRight:'10%'
            }}>
              <div>
                <Header style={{fontSize:'3em'}}>
                  GREMLIN
                  <Header.Subheader style={{fontSize:'.5em'}}>Low-Code Microservices</Header.Subheader>
                </Header>
              </div>
            </div>
          </div>
          <div>
            <Form size='large'>
              <Segment style={{width:'25vw', maxWidth:'300px'}}>
                <Header as='h4' textAlign='left'>Please Login:</Header>
                <Form.Input 
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  value={this.state.userNameValue}
                  onChange = {(data) => {this.setState({userNameValue: `${data.target.value}`})}}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  value={this.state.passwordValue}
                  onChange = {(data) => {this.setState({passwordValue: `${data.target.value}`})}}
                />
                <Button color='teal' fluid size='large' onClick={() => this.tryLogin()}>
                  Login
                </Button>
              </Segment>
              </Form>
              <Message>
                <span 
                  style={{
                    cursor:"pointer",
                    color:"blue",
                    textDecoration:"underline"
                  }}
                  onClick={()=>this.toggleRecoveryModal()}
                >
                  Forgot
                </span> your password or username?
              </Message>
          </div>
        </div>
        <div style={{
            zIndex: 100,
            position: 'absolute',
            bottom: '1vh',
            right: '1vw'
          }}>
            <Image style={{height:'6vh'}} src='/os_legal_128_name_left.png'/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;
  return {
    auth
  }
}

export default connect(mapStateToProps)(Login)