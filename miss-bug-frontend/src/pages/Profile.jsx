import { useState, useEffect } from 'react'
import { userService } from '../services/user/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useParams } from 'react-router'

export function Profile() {
	const { userId } = useParams()
	const [bugs, setBugs] = useState([])
	const [user, setUser] = useState(null)

	useEffect(() => {
		loadUser()
		loadBugs()
	}, [])

	async function loadUser() {
		try {
			const user = await userService.getById(userId)
			setUser(user)
		} catch (error) {
			console.log('error:', error)
			showErrorMsg('Problems getting user:', error)
		}
	}

	async function loadBugs() {
		try {
			const bugs = await bugService.query({ creatorId: userId })
			setBugs(bugs)
			console.log("🚀 ~ loadBugs ~ bugs:", bugs)
		} catch (error) {
			console.log('error:', error)
			showErrorMsg('Problems getting bugs:', error)
		}
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
		<section className='profile-page'>
			<h2>User Profile</h2>
			{user && (
				<div className='user-info'>
					<p><strong>Name:</strong> {user.fullname}</p>
				</div>
			)}
			<h3>User's Bugs</h3>
			<BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
		</section>
	)
}
