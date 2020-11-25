import React, { Component } from 'react'
import { 
    Grid,
    Segment,
    Button,
    Icon,
    Pagination,
    Table,
    Form,
    Dimmer,
    Loader
} from 'semantic-ui-react'
    
import NewUserModal from './NewUserModal';
import UserRow from './UserRow';
import {HorizontallyJustifiedDiv, VerticallyCenteredDiv} from '../Shared/Wrappers';
import { UserTable } from './UserTable';

const UserCreateAndSearchBar = (props) => {
    return (<Segment>
        <HorizontallyJustifiedDiv>
            <div style={{width:'25vw'}}>
                <Form  onSubmit={props.handleFetchUsers}>
                    <Form.Input
                        icon={<Icon name='search' inverted circular link />}
                        placeholder='Search...'
                        onChange={(data)=>props.handleSetUserNameFilter(data.target.value)}
                        value={props.filterValue}
                    />
                </Form>
            </div>
            <div>
                <Button color='green' onClick={() => props.handleToggleInviteUserModal()}>
                    <Icon name='plus square' />Invite New User
                </Button>
            </div>
        </HorizontallyJustifiedDiv>
    </Segment>);
}

class UserTab extends Component {

    componentDidMount() {
        this.props.handleFetchUsers();
    }

    render() {

        const {
            items,
            loading,
            page, 
            pages,
            searchText,
            selectedUser
        } = this.props.users;

        const { 
            handleDeleteUser,
            showInviteModal,
            handleToggleInviteUserModal
        } = this.props;

        const users = items ? items : [];

        let rows = [];
        if (users.length > 0) {
            for (let i = 0; i < users.length; i++) {
                rows.push(<UserRow 
                        key={users[i].id}
                        user={users[i]}
                        selected={users[i].id===selectedUser}
                        onDelete={handleDeleteUser}
                        handleChangeUserPermissions={this.props.handleChangeUserPermissions}
                    />);
            }
        }
        else {
            rows.push(<Table.Row  key={0}>
                <Table.Cell textAlign='center' colSpan='8'>No users match your selection</Table.Cell>
            </Table.Row>);
        }
        
        return (
            <VerticallyCenteredDiv>
                <NewUserModal
                    handleInviteUser={this.props.handleCreateUser}
                    toggle={handleToggleInviteUserModal}
                    visible={showInviteModal}
                />
                 {loading? <Dimmer active>
                        <Loader>Loading...</Loader>
                    </Dimmer> : <></>}
                <UserCreateAndSearchBar
                    handleSetUserNameFilter={this.props.handleSetUserNameFilter}
                    handleToggleInviteUserModal={handleToggleInviteUserModal}
                    handleFetchUsers={this.props.handleFetchUsers}
                    filterValue={searchText}
                />
                <UserTable>
                    {rows}
                </UserTable>
                <div style={{
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        marginTop:'2vh'
                    }}>
                        <div>
                            <Pagination
                                activePage={page}
                                onPageChange={(e, { activePage }) => this.props.handleUserPageChange(activePage)}
                                totalPages={pages}
                            />
                        </div>
                </div>
            </VerticallyCenteredDiv>
        );
    }
}

export default UserTab;
