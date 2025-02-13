import { useState, useEffect } from 'react'

export function BugFilter({ filterBy, onSetFilterBy }) {
	const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

	useEffect(() => {
		const timeout = setTimeout(() => {
			onSetFilterBy(filterByToEdit)
		}, 400)

		return () => clearTimeout(timeout)
	}, [filterByToEdit])

	function handleChange({ target }) {
		const field = target.name
		let value = target.value

		switch (target.type) {
			case 'number':
				value = +value || ''
				break
			case 'checkbox':
				value = target.checked
				break
			default:
				break
		}

		setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
	}

	function handleLabelsChange({ target }) {
		const labels = target.value.split(',').map((label) => label.trim())
		setFilterByToEdit((prevFilter) => ({ ...prevFilter, labels }))
	}

	const { title, minSeverity, labels } = filterByToEdit

	return (
		<section className='bug-filter'>
			<h2>Filter Our Bugs</h2>
			<form>
				<label htmlFor='title'>Title: </label>
				<input
					value={title}
					onChange={handleChange}
					type='text'
					placeholder='By Description'
					id='title'
					name='title'
				/>

				<label htmlFor='minSeverity'>Minimum Severity: </label>
				<input
					value={minSeverity}
					onChange={handleChange}
					type='number'
					placeholder='By Severity'
					id='minSeverity'
					name='minSeverity'
				/>

				<label htmlFor='labels'>Labels (comma-separated): </label>
				<input
					value={labels.join(',')}
					onChange={handleLabelsChange}
					type='text'
					placeholder='ui, backend...'
					id='labels'
				/>
			</form>
		</section>
	)
}
