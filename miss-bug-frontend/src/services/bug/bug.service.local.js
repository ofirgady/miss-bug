import { storageService } from '../async-storage.service.js'

export const bugService = {
	query,
	getById,
	save,
	remove,
	getDefaultFilter,
    getDefaultSort,
}
const STORAGE_KEY = 'bugDB'

async function query(filterBy = {}) {
    try {

        let bugsToDisplay = await storageService.query(STORAGE_KEY)

		if (filterBy.title) {
			const regExp = new RegExp(filterBy.title, 'i')
			bugsToDisplay = bugsToDisplay.filter((bug) => regExp.test(bug.title))
		}

		if (filterBy.minSeverity) {
			bugsToDisplay = bugsToDisplay.filter((bug) => bug.severity >= filterBy.minSeverity)
		}

		if ('pageIdx' in filterBy) {
			const startIdx = filterBy.pageIdx * PAGE_SIZE
			bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
		}

		console.log('bugs:', bugsToDisplay )

		return bugsToDisplay
	} catch (err) {
		console.error(`Couldn't get bugs`)
		throw err
	}
}

function getById(bugId) {
	return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
	return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
	const method = bug._id ? 'put' : 'post'
	return storageService[method](STORAGE_KEY, bug)
}

function getDefaultFilter() {
	return { title: '', minSeverity: 0, labels: [] }
}


function getDefaultSort() {
    return { by: '', sortDir: '1' }
}
