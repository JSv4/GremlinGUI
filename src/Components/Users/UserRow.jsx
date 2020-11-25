import React, { useState } from 'react';
import {Table, Confirm, Button, Dropdown} from 'semantic-ui-react';

function RoleDropdown(props) {
    const {user, handleChangeUserPermissions} = props;

    let roles = ["ADMIN", "LAWYER", "LEGAL_ENG"];

    if (user.role==="ADMIN") {
        roles = [];
    }
    else if (user.role==="LAWYER") {
        roles = roles.filter(role => role!=="LAWYER");
    }
    else if (user.role==="LEGAL_ENG") {
        roles = roles.filter(role => role!=="LEGAL_ENG");
    }
    else {
        roles = [];
    }

    let options = [];
    if (roles.length > 0) {
        options = roles.map((option) => <Dropdown.Item onClick={() => 
            handleChangeUserPermissions(user.id, option)}>{option}</Dropdown.Item>);
    }
    else {
        options = [<Dropdown.Item disabled>Can't Change Admin</Dropdown.Item>];
    }
    
    return (
        <Dropdown 
            trigger={<Button
                icon='caret down'
                basic
                circular
            />}
            options={options}
            pointing='top left'
            icon={null}    
        />
    );
}

function UserRow(props) {
   
    const {user, onDelete, handleChangeUserPermissions} = props;

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function deleteRow(userId) {
        onDelete(user.id);
        setShowDeleteModal(false);
    }

    return (
        <>
            <Confirm
                open={showDeleteModal}
                content={`You have chosen to delete user with username ${user.username}. Their jobs will be preserved, but only an admin can retrieve them. ARE YOU SURE?`}
                confirmButton="DELETE"
                onCancel={() => setShowDeleteModal(!showDeleteModal)}
                onConfirm={() => deleteRow(user.id)}
            />
            <Table.Row key={user.id}>
                <Table.Cell width={4}>{user.username}</Table.Cell>
                <Table.Cell width={3}>{user.email}</Table.Cell>
                <Table.Cell width={3}>{user.name}</Table.Cell>
                <Table.Cell width={3}>{user.role}</Table.Cell>
                <Table.Cell textAlign='center' width={2}>
                    <Button 
                        icon='trash'
                        basic
                        circular
                        color='red'
                        onClick={() => setShowDeleteModal(!showDeleteModal)}
                    />
                    <RoleDropdown
                        user={user}
                        handleChangeUserPermissions={handleChangeUserPermissions}
                    />
                </Table.Cell>
            </Table.Row>
        </>
        
    );
}

export default UserRow;
