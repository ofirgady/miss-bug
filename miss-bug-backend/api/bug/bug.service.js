import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const bugService = {
	query,
	getById,
	remove,
	save,
}

const bugs = utilService.readJsonFile('./data/bugs.json')
const PAGE_SIZE = 4

async function query(filterBy, sortBy) {
	let bugsToDisplay = bugs
	try {
		if (filterBy.title) {
			const regExp = new RegExp(filterBy.title, 'i')
			bugsToDisplay = bugsToDisplay.filter((bug) => regExp.test(bug.title))
		}

		if (filterBy.minSeverity) {
			bugsToDisplay = bugsToDisplay.filter((bug) => bug.severity >= filterBy.minSeverity)
		}

        if (filterBy.labels && filterBy.labels.length > 0) {
            const labelsSet = new Set(filterBy.labels.map(label => label.toLowerCase()))
            bugsToDisplay = bugsToDisplay.filter(bug => bug.labels && bug.labels.some((bugLabel) => labelsSet.has(bugLabel.toLowerCase())))
        }

        // Pagination
		if (filterBy.pageIdx !== undefined) {
            const startIdx = +filterBy.pageIdx * PAGE_SIZE;
            bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }

		// Sorting
		if (sortBy.by === 'severity') {
			const dir = sortBy.sortDir ? +sortBy.sortDir : 1
			bugsToDisplay.sort((b1, b2) => (b1.severity - b2.severity) * dir)
		} else if (sortBy.by === 'title') {
			const dir = sortBy.sortDir ? +sortBy.sortDir : 1
			bugsToDisplay.sort((b1, b2) => b1.title.localeCompare(b2.title) * dir)
		}
        else if (sortBy.by === 'createdAt') {
			const dir = sortBy.sortDir ? +sortBy.sortDir : 1
			bugsToDisplay.sort((b1, b2) => (b1.createdAt - b2.createdAt) * dir)
		}

		// console.log({ bugs: bugsToDisplay })

		return bugsToDisplay
	} catch (err) {
		loggerService.error(`Couldn't get bugs`)
		throw err
	}
}

async function getById(bugId) {
	try {
		const bug = bugs.find((bug) => bug._id === bugId)
		if (!bug) throw `Bad bug id ${bugId}`
		return bug
	} catch (err) {
		loggerService.error(`Couldn't get bug ${bugId}`)
		throw err
	}
}

async function remove(bugId) {
	try {
		const idx = bugs.findIndex((bug) => bug._id === bugId)
		if (idx === -1) throw `Bad bug id ${bugId}`
		bugs.splice(idx, 1)

		await utilService.writeJsonFile('./data/bugs.json', bugs)
		return
	} catch (err) {
		loggerService.error(`Couldn't remove bug ${bugId}`)
		throw err
	}
}

async function save(bugToSave) {
	try {
		if (bugToSave._id) {
			const idx = bugs.findIndex((bug) => bug._id === bugToSave._id)
			if (idx === -1) throw `Bad bug id ${bugId}`
			bugs.splice(idx, 1, { ...bugs[idx], ...bugToSave })
		} else {
			bugToSave._id = utilService.makeId()
			bugToSave.score = Date.now()
			bugs.push(bugToSave)
		}
		await utilService.writeJsonFile('./data/bugs.json', bugs)
		return bugToSave
	} catch (err) {
		loggerService.error(`Couldn't save bug ${bugId}`)
		throw err
	}
}
