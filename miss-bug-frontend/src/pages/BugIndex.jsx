import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { useSearchParams } from 'react-router-dom'

export function BugIndex() {
	const [bugs, setBugs] = useState([])
	const [searchParams, setSearchParams] = useSearchParams()
	const defaultFilter = bugService.getFilterFromSearchParams(searchParams)
	const [filterBy, setFilterBy] = useState(defaultFilter)

	useEffect(() => {
		loadBugs()
		setSearchParams(filterBy)
	}, [JSON.stringify(filterBy)])

	async function loadBugs() {
		console.log(filterBy)
		try {
			const bugs = await bugService.query(filterBy)
			console.log('returned bugs:', bugs)
			setBugs(bugs)
		} catch (error) {
			console.log('error:', error)
			showErrorMsg('Problems getting bugs:', error)
		}
	}

	function onSetFilterBy(filterBy) {
		setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
	}

	async function onRemoveBug(bugId) {
		try {
			await bugService.remove(bugId)
			console.log('Deleted Succesfully!')
			setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId))
			showSuccessMsg('Bug removed')
		} catch (err) {
			console.log('Error from onRemoveBug ->', err)
			showErrorMsg('Cannot remove bug')
		}
	}

	async function onAddBug() {
		const bug = {
			title: prompt('Bug title?'),
			description: prompt('Bug description?'),
			severity: +prompt('Bug severity?'),
		}
		try {
			const savedBug = await bugService.save(bug)
			console.log('Added Bug', savedBug)
			setBugs((prevBugs) => [...prevBugs, savedBug])
			showSuccessMsg('Bug added')
		} catch (err) {
			console.log('Error from onAddBug ->', err)
			showErrorMsg('Cannot add bug')
		}
	}

	async function onCreateBugsPDF() {
		// try {
		// 	const blob = await bugService.createBugsPDF()
		// 	const link = document.createElement('a')
		// 	link.href = window.URL.createObjectURL(blob)
		// 	link.download = 'bug_report.pdf'
		// 	link.click()
		// 	showSuccessMsg('Bugs PDF created')
		// } catch (err) {
		// 	console.log('Error from createBugsPDF ->', err)
		// 	showErrorMsg('Cannot create PDF')
		// }
	}

	async function onEditBug(bug) {
		const severity = +prompt('New severity?')
		const bugToSave = { ...bug, severity }
		try {
			const savedBug = await bugService.save(bugToSave)
			console.log('Updated Bug:', savedBug)
			setBugs((prevBugs) =>
				prevBugs.map((currBug) => (currBug._id === savedBug._id ? savedBug : currBug))
			)
			showSuccessMsg('Bug updated')
		} catch (err) {
			console.log('Error from onEditBug ->', err)
			showErrorMsg('Cannot update bug')
		}
	}

	return (
		<main className='main-layout'>
			<h3>Bugs App</h3>
			<BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
			<main>
				<button onClick={onAddBug}>Add Bug</button>
				<button onClick={onCreateBugsPDF}>Create Bugs PDF</button>
				<BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
			</main>
		</main>
	)
}
