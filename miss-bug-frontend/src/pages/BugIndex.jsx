import { bugService } from '../services/bug'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { debounce } from '../services/util.service.js'
import { BugSort } from '../cmps/BugSort.jsx'

export function BugIndex() {
	const [bugs, setBugs] = useState([])
	const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
	const [sortBy, setSortBy] = useState(bugService.getDefaultSort())
	const onSetFilterBy = useCallback(debounce(_onSetFilterBy, 350), [])

	useEffect(() => {
		loadBugs()
	}, [filterBy, sortBy])

	async function loadBugs() {
		// console.log(filterBy)
		// console.log(sortBy)
		try {
			const bugs = await bugService.query(filterBy, sortBy)
			setBugs(bugs)
		} catch (error) {
			console.log('error:', error)
			showErrorMsg('Problems getting bugs:', error)
		}
	}

	function _onSetFilterBy(filterBy) {
		setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
	}
	
    function onSetSortBy(fieldsToUpdate) {
        setSortBy(prevSortBy => ({ ...prevSortBy, ...fieldsToUpdate }))
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

	async function onEditBug(bugId) {
		const severity = +prompt('New severity?')
		let bugToSave = await bugService.getById(bugId)
		bugToSave = { ...bugToSave, severity}
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

	function onChangePageIdx(pageIdx) {
		if (pageIdx < 0) return
		setFilterBy((prevFilter) => ({ ...prevFilter, pageIdx }))
	}

	if (!bugs) return <div>Loading...</div>
	const {pageIdx, ...restOfFilter} = filterBy
	const isPaging = pageIdx !== undefined

	return (
		<main className='main-layout'>
			<h3>Bugs App</h3>
			<BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
			<BugSort sortBy={sortBy} onSetSortBy={onSetSortBy} />
			<div className="car-pagination">
                <label> Use paging
                    <input type="checkbox" checked={isPaging} onChange={() => onChangePageIdx(isPaging ? undefined : 0)} />
                </label>
                {isPaging && <>
                    <button onClick={() => onChangePageIdx(pageIdx - 1)}>-</button>
                    <span>{pageIdx + 1}</span>
                    <button onClick={() => onChangePageIdx(pageIdx + 1)}>+</button>
                </>}
            </div>
			<main>
				<button onClick={onAddBug}>Add Bug</button>
				<BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
			</main>
		</main>
	)
}
