import Axios from 'axios'

var axios = Axios.create({
	withCredentials: true,
})

export const bugService = {
	query,
	getById,
	save,
	remove,
	getFilterFromSearchParams,
	// createBugsPDF,
}

const BASE_URL = `//localhost:3030/api/bug/`

async function query(filterBy = {}) {
	try {
		let { data: bugs } = await axios.get(BASE_URL)

		// now we will filter the bugs with filterBy
		const regExp = new RegExp(filterBy.title, 'i')
		bugs = bugs.filter((bug) => regExp.test(bug.title))

		if (filterBy.minSeverity) {
			bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity)
		}

		console.log({ bugs: bugs })
		return bugs
	} catch (e) {
		console.log(e)
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
		return axios.get(BASE_URL + bugId + `/remove`)
	} catch (error) {
		console.log(error)
		throw error
	}
}

async function save(bug) {
	try {
		const { _id, title, severity } = bug
		const queryParams = `save?_id=${_id || ''}&title=${title}&severity=${severity}`

		let { data: savedBug } = await axios.get(BASE_URL + queryParams)
		console.log(savedBug)
		return savedBug
	} catch (error) {
		console.log(error)
		throw error
	}
}

function _getDefaultFilter() {
	return { title: '', minSeverity: 0 }
}

function _getEmptyBug(title = '', severity = '') {
	return { _id: '', title, severity }
}

function getFilterFromSearchParams(searchParams) {
	const defaultFilter = _getDefaultFilter()
	const filterBy = {}
	for (const field in defaultFilter) {
		filterBy[field] = searchParams.get(field) || defaultFilter[field]
	}
	return filterBy
}

// async function createBugsPDF() {
// 	try {
// 		const { data: response } = await axios.get(BASE_URL + `/generate-pdf`)
// 		const blob = new Blob([response], {type: "application/pdf" })
// 		return blob
// 	} catch (error) {
// 		console.log(error)
// 		throw error
// 	}
// }
