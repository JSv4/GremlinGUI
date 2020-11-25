import React, {Component} from 'react';
import { 
    Label,
    Modal,
    Button,
    Grid, 
    Divider,
    Segment,
    Header,
    Icon,
    Form
} from 'semantic-ui-react';

const RecoverForms = (state, setState, selectUser, selectPassword, handleSubmit, handleChange) => {

    if (state.type==="PASSWORD") {
        return (
            <Form onSubmit={handleSubmit}>
                <div style={{
                        display: 'flex',
                        flexDirection:'row',
                        justifyContent: 'center',
                        alignItems:'center'
                    }}>
                    <div>
                        <Header as='h2' icon>
                            <Icon name='lock open' />
                            Reset Password
                            <Header.Subheader>
                            Enter your username. If it's valid, we'll email a temporary password to you.
                            </Header.Subheader>
                        </Header>
                    </div>
                </div>
                <Form.Input
                    label='Username:'
                    placeholder='Username:'
                    name='username'
                    value={state.username}
                    onChange={handleChange}
                />
                <Form.Button content='Submit' />
            </Form>
        );
    }
    else if (state.type==="USERNAME") {
        return (
            <Form onSubmit={handleSubmit}>
                 <div style={{
                        display: 'flex',
                        flexDirection:'row',
                        justifyContent: 'center',
                        alignItems:'center'
                    }}>
                    <div>
                        <Header as='h2' icon>
                            <Icon name='user circle outline' />
                            Recover Username
                            <Header.Subheader>
                            Enter your eMail. If it's valid, we'll send you an e-mail with your username.
                            </Header.Subheader>
                        </Header>
                    </div>
                </div>
                <Form.Input
                    label='E-Mail'
                    placeholder='E-Mail'
                    name='email'
                    value={state.password}
                    onChange={handleChange}    
                />
                <Form.Button content='Submit' />
            </Form>
        )
    }
    else {
        return(
            <Segment placeholder>
                <Grid columns={2} stackable textAlign='center'>
                    <Divider vertical>Or</Divider>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                            <Header icon>
                                <Icon name='user circle outline' />
                            </Header>
                            <Button primary onClick={selectUser}>Forgot Username</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Header icon>
                                <Icon name='lock open'/>  
                            </Header>
                            <Button primary onClick={selectPassword}>Forgot Password</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

const defaultProps = {
    username:"",
    email:"",
    type: null,
    error: false,
    success: false
};

//This is a pop-up modal that lets you create a new job.
export default class RecoverAccountModal extends Component {

    constructor(props) {
        super(props);
        this.state=defaultProps;
    }
    
    resetState = () => {
        this.setState(defaultProps);
        this.props.toggle();
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = () => {

        const { username, email, type } = this.state
        const { handleRecoverUsername, handleResetPassword } = this.props;

        if (type==="PASSWORD") {
            console.log("Reset password for username:", username);
            handleResetPassword(username); 
        }
        else if (type==="USERNAME") {
            console.log("Send username to:", email);
            handleRecoverUsername(email);
        }
        else {
            this.setState({
                error: true
            });
            this.props.toggle();
        }
        setTimeout(this.resetState, 2000);
    }

    selectPassword = () => {
        this.setState({
            type: "PASSWORD"
        });
    }

    selectUser = () => {
        this.setState({
            type: "USERNAME"
        });
    }

    toggleModal = () => {
        this.props.toggle();
        this.setState(defaultProps);
    }

    render() {
        return(
            <Modal open={this.props.visible} size='mini'>
                <Label 
                    corner='right'
                    color='grey'
                    icon='cancel'
                    onClick={()=>this.toggleModal()}
                />
                <Modal.Content>
                   {RecoverForms(this.state, this.setState, this.selectUser, this.selectPassword, this.handleSubmit, this.handleChange)} 
                </Modal.Content>
            </Modal>
          );
    }
}
