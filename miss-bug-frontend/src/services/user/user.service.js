import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3030/api/'

const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    getEmptyUser
}

window.userService = userService

async function getUsers() {
    try {
        console.log('Fetching users from backend');
        const { data: users } = await axios.get(BASE_USER_URL)
        console.log('Users:', users);
        return users
    } catch (err) {
        console.error('Failed to get users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const { data: user } = await axios.get(BASE_USER_URL + userId)
        return user
    } catch (err) {
        console.error(`Failed to get user with id ${userId}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        return await axios.delete(BASE_USER_URL + userId)
    } catch (err) {
        console.error(`Failed to remove user with id ${userId}`, err)
        throw err
    }
}

async function update(userToUpdate) {
    try {
		const { data: updatedUser } = await axios.put(BASE_USER_URL + userToUpdate._id, userToUpdate)

		// If the updated user is the logged in user, update the local storage
        const loggedInUser = getLoggedinUser()
        if (loggedInUser && loggedInUser._id === updatedUser._id) {
            saveLocalUser(updatedUser)
        }
        return updatedUser
    } catch (err) {
        console.error('Failed to update user', err)
        throw err
    }
}

async function login(credentials) {
    try {
        const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
        if (user) {
            return saveLocalUser(user)
        }
    } catch (err) {
        console.error('Failed to login', err)
        throw err
    }
}

async function signup(credentials) {
    try {
        console.log('Signing up user:', credentials);
        const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
        console.log('User signed up:', user);
        return saveLocalUser(user)
    } catch (err) {
        console.error('Failed to signup', err)
        throw err
    }
}

async function logout() {
    try {
        await axios.post(BASE_AUTH_URL + 'logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    } catch (err) {
        console.error('Failed to logout', err)
        throw err
    }
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
    }
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

