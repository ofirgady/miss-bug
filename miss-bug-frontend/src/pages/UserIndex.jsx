import { useState, useEffect } from "react"

import { userService } from '../services/user/user.service.js';
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";

export function UserIndex() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
            try {
                const users = await userService.query()
                setUsers(users)
            } catch (error) {
                console.log('error:', error)
                showErrorMsg('Problems getting users:', error)
            }
        }

    async function onRemoveUser(userId) {
        try {

            await userService.remove(userId)
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
            console.log('Removed successfully');
        } catch (err) {
            console.log('Error: ', err.response.data)

        }
    }

    async function onAddUser() {
            const user = {
                fullName: prompt('User fullName?'),
                userName: prompt('User userName?'),
                password: prompt('User password?'),
            }
            try {
                const savedUser = await userService.save(user)
                console.log('Added User', savedUser)
                setUsers((prevUsers) => [...prevUsers, savedUser])
                showSuccessMsg('User added')
            } catch (err) {
                console.log('Error from onAddUser ->', err)
                showErrorMsg('Cannot add user')
            }
        }

    return <section className="admin-dashboard">

        <hr />

        <h3>Here are the users</h3>
        <button onClick={() => onAddUser()}>Add new user</button>

        {
            users.map(user => <div key={user._id} style={{ border: "1px solid black", padding: "15px", margin: "10px" }}>
                <h4>user name: {user.username}</h4>
                <h4>id: {user._id}</h4>
                <button onClick={() => onRemoveUser(user._id)}>Remove this user</button>
            </div>)
        }


        <pre>
            {JSON.stringify(users, null, 2)}
        </pre>


    </section>
}