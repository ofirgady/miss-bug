import Axios from 'axios'

var axios = Axios.create({
	withCredentials: true,
})

const BASE_URL = `//localhost:3030/api/user/`

export const userService = {
	query,
	getById,
	save,
	remove,
}

async function query() {
	try {
		const { data: users } = await axios.get(BASE_URL)
		return users
	} catch (e) {
		console.log('there was an error here',e)
	}
}

async function getById(userId) {
	try {
		const { data: user } = await axios.get(BASE_URL + userId)
		return user
	} catch (error) {
		console.log(error)
		throw error
	}
}

function remove(userId) {
	try {
		return axios.delete(BASE_URL + userId)
	} catch (error) {
		console.log(error)
		throw error
	}
}

async function save(userToSave) {
	try {
		if (userToSave._id) {
			const { data: savedUser } = await axios.put(BASE_URL + userToSave._id, userToSave)
			return savedUser
		} else {
			const { data: savedUser } = await axios.post(BASE_URL, userToSave)
			return savedUser
		}
	} catch (error) {
		console.log(error)
		throw error
	}
}

