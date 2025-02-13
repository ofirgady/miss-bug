import Axios from 'axios'

var axios = Axios.create({
	withCredentials: true,
})

const BASE_URL = `//localhost:3030/api/bug/`

export const bugService = {
	query,
	getById,
	save,
	remove,
	getDefaultFilter,
	getDefaultSort
}

async function query(filterBy = {title: ''}, sortBy = {by: '', sortDir: ''}) {
	try {
		const { data: bugs } = await axios.get(BASE_URL, {params: { filterBy, sortBy } } )
		return bugs
	} catch (e) {
		console.log('there was an error here',e)
	}
}

async function getById(bugId) {
	try {
		const { data: bug } = await axios.get(BASE_URL + bugId)
		return bug
	} catch (error) {
		console.log(error)
		throw error
	}
}

function remove(bugId) {
	try {
		return axios.delete(BASE_URL + bugId)
	} catch (error) {
		console.log(error)
		throw error
	}
}

async function save(bugToSave) {
	try {
		if (bugToSave._id) {
			const { data: savedBug } = await axios.put(BASE_URL + bugToSave._id, bugToSave)
			return savedBug
		} else {
			const { data: savedBug } = await axios.post(BASE_URL, bugToSave)
			return savedBug
		}
	} catch (error) {
		console.log(error)
		throw error
	}
}

function getDefaultFilter() {
	return { title: '', minSeverity: 0, labels: [] }
}


function getDefaultSort() {
    return { by: '', sortDir: '1' }
}

function _getEmptyBug(title = '', severity = '') {
	return { _id: '', title, severity }
}


// not used at the moment //
// function getFilterFromSearchParams(searchParams) {
// 	const defaultFilter = getDefaultFilter()
// 	const filterBy = {}
// 	for (const field in defaultFilter) {
// 		filterBy[field] = searchParams.get(field) || defaultFilter[field]
// 	}
// 	return filterBy
// }
