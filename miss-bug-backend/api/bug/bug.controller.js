import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"


export async function getBugs(req, res) {
    try {
        const {by, sortDir} = req.query.sortBy
        const filterBy = {
            title: req.query.filterBy.title,
            minSeverity: +req.query.filterBy.minSeverity,
            labels: req.query.filterBy.labels
        }

        if (req.query.pageIdx) filterBy.pageIdx = +pageIdx;

        const sortBy = {
            by: req.query.sortBy.by,
            sortDir: req.query.sortBy.sortDir,
        }

		const bugs = await bugService.query(filterBy, sortBy)
		res.send(bugs)
	} catch (err) {
		loggerService.error(err.message)
		res.status(400).send(`Couldn't get bugs`)
	}
}

export async function getBug(req, res) {
    const { bugId } = req.params
        try {
            let visitBugs = req.cookies.visitBugs || []
            visitBugs = [...visitBugs, bugId]
            if (visitBugs.length > 3) {
                res.status(401).send('You have reached the maximum number of visits for this bug. Please wait 30 seconds before trying again.')
                return
            }
            const bug = await bugService.getById(bugId)
            res.cookie('visitBugs', visitBugs, { maxAge: 1000 * 7 })
            res.send(bug)
        } catch (err) {
            loggerService.error(err.message)
            res.status(400).send(`Couldn't get bug`)
        }
}

export async function addBug(req, res) {
    const {title, severity } = req.body
        const bugToSave = { title, severity: +severity }
        try {
            const savedBug = await bugService.save(bugToSave)
            res.send(savedBug)
        } catch (err) {
            loggerService.error(err.message)
            res.status(400).send(`Couldn't save bug`)
        }
}

export async function updateBug(req, res) {
    const { _id, title, severity } = req.body
        const bugToSave = { _id, title, severity: +severity }
        try {
            const savedBug = await bugService.save(bugToSave)
            res.send(savedBug)
        } catch (err) {
            loggerService.error(err.message)
            res.status(400).send(`Couldn't save bug`)
        }
}

export async function removeBug(req, res) {
    const { bugId } = req.params
	try {
		await bugService.remove(bugId)
		res.send('Bug Deleted')
	} catch (err) {
		loggerService.error(err.message)
		res.status(400).send(`Couldn't remove bug`)
	}
}
