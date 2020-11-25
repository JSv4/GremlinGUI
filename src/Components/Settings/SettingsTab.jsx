import React, { Component } from 'react'
import { 
    List,
    Card,
    Tab,
    Message,
    Segment,
    Accordion,
    Icon,
    Button
} from 'semantic-ui-react'

import {
    resetPassword_Schema,
    resetPassword_Ui_Schema
} from '../Forms/FormSchemas';
import { 
    validateResetPassword
} from '../Forms/Validators';
import Form from "@rjsf/semantic-ui";


export default class SettingsTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showChangePasswordModal: false,
            expandPasswordReset: false,
            old_password: '',
            new_password: '',
            new_password2: ''
        };
    }

    handleResetValuesChange = ({formData}) => {
        console.log(`update`, formData);
        this.setState(formData);
    }

    resetChangePasswordForm = (success) => {
        this.setState = ({
            expandPasswordReset: false,
            old_password: '',
            new_password: '',
            new_password2: ''
        });
    }

    handleResetValuesSubmit = () => {
        console.log(`Try to reset password with old_password ${this.state.old_password}, 
                    old_password2 ${this.state.old_password2} and new_password ${this.state.new_password}`);
        this.props.handleChangePassword(this.state.old_password, this.state.new_password);
        this.togglePasswordReset();
    }

    togglePasswordReset = () => {
        this.setState({
            expandPasswordReset: !this.state.expandPasswordReset
        });
    }

    toggleChangePasswordModal = () => {
        this.setState({
            showChangePasswordModal: !this.state.showChangePasswordModal
        });
    }

    render() {
        const {email, name, role, username} = this.props.user;

        const panes = [
            { 
                menuItem: 'Current User', 
                render: () => <Tab.Pane>
                    <Card fluid>
                        <Card.Content header='User Information' />
                        <Card.Content>
                            <List>
                                <List.Item>
                                    <List.Icon name='users' />
                                    <List.Content>{name}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Icon name='user outline' />
                                    <List.Content>{username}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Icon name='mail' />
                                    <List.Content>
                                        <a href='mailto:jack@semantic-ui.com'>{email}</a>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Icon name='linkify' />
                                    <List.Content>User Type: {role}</List.Content>
                                </List.Item>
                            </List>
                        </Card.Content>
                        <Card.Content extra>
                            <Accordion fluid styled>
                                <Accordion.Title
                                    active={this.state.expandPasswordReset}
                                    index={0}
                                    onClick={this.togglePasswordReset}
                                >
                                <Icon name='dropdown' />
                                Change Password
                                </Accordion.Title>
                                <Accordion.Content active={this.state.expandPasswordReset}>
                                    <Form 
                                        schema={resetPassword_Schema}
                                        uiSchema={resetPassword_Ui_Schema}
                                        validate={validateResetPassword}
                                        onChange={this.handleResetValuesChange}
                                        formData={this.state}
                                    >
                                        <Button color='blue' onClick={this.handleResetValuesSubmit}>Change Password</Button>
                                    </Form>
                                </Accordion.Content>
                            </Accordion>
                        </Card.Content>
                    </Card>
                </Tab.Pane>
            },
            { menuItem: 'System Settings', render: () => <Tab.Pane>
                    <Segment style={{width:'100%'}}>
                        <Message
                            icon='inbox'
                            header='Coming Soon!'
                            content='For now, please use the admin panel on the backend.'
                        />
                    </Segment>
                </Tab.Pane> }
          ]
        
        if (role==='ADMIN'){
            panes.push({ 
                menuItem: 'Admin Settings',
                render: () => <Tab.Pane>
                    <Segment style={{width:'100%'}}>
                        <Message
                            icon='inbox'
                            header='Coming Soon!'
                            content='For now, please use the admin panel on the backend.'
                        />
                    </Segment>
                </Tab.Pane> 
            });
        }

        return (
            <div>
                <Tab
                    menu={{ fluid: true, vertical: true }}
                    menuPosition='right'
                    panes={panes}
                    style={{minHeight:'40vh'}}
                />
            </div>
        );
    }
}