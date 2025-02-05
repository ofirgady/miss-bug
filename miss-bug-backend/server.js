import fs from 'fs'
import express from 'express'
import cors from 'cors'
import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'
import PDFDocument from 'pdfkit'

const corsOptions = {
	origin: ['http://127.0.0.1:5174', 'http://localhost:5174'],
	credentials: true,
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', async (req, res) => {
	try {
		const bugs = await bugService.query()
		res.send(bugs)
	} catch (err) {
		loggerService.error(err.message)
		res.status(400).send(`Couldn't get bugs`)
	}
})

app.get('/api/bug/save', async (req, res) => {
	const { _id, title, severity } = req.query
	const bugToSave = { _id, title, severity: +severity }

	try {
		const savedBug = await bugService.save(bugToSave)
		res.send(savedBug)
	} catch (err) {
		loggerService.error(err.message)
		res.status(400).send(`Couldn't save bug`)
	}
})

app.get('/api/bug/:bugId', async (req, res) => {
	const { bugId } = req.params

	try {
		const bug = await bugService.getById(bugId)
		res.send(bug)
	} catch (err) {
		loggerService.error(err.message)
		res.status(400).send(`Couldn't get bug`)
	}
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
	const { bugId } = req.params
	try {
		await bugService.remove(bugId)
		res.send('OK')
	} catch (err) {
		loggerService.error(err.message)
		res.status(400).send(`Couldn't remove bug`)
	}
})

// app.get('/api/bug/generate-pdf', async (req, res) => {
// 	try {
// 		const blob  = await bugService.generateBugsPDF(
// 		res.send(blob)
// 		)
// 	} catch (error) {
// 		loggerService.error(err.message)
// 		res.status(400).send(`Couldn't generate pdf`)
// 	}
// })

app.listen(3030, () => {
	loggerService.info(`Example app listening on port 3030`)
})
