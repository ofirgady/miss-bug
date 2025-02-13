import { useEffect, useState } from "react"

export function BugSort({ sortBy, onSetSortBy }) {

	const [sortByToEdit, setSortByToEdit] = useState(sortBy)

	useEffect(() => {
		onSetSortBy(sortByToEdit)
	}, [sortByToEdit])

	function handleSortChange({ target }) {
		const field = target.name;
    	let value = target.value;
		setSortByToEdit((prevSortBy) => ({ ...prevSortBy, [field]: value }))
	}

	const {by, sortDir} = sortByToEdit

	return <section className="bug-sort">
		<label htmlFor="selectOption">Sort by:</label>
		<select id="selectOption" name="by" onChange={handleSortChange} value={by}>
			<option value=""></option>
			<option value="severity">Severity</option>
			<option value="title">Title</option>
			<option value="createdAt">Time of creation</option>
		</select>

		<label htmlFor="sortDir">Sorting order:</label>
		<select id="sortDir" name="sortDir" onChange={handleSortChange} value={sortDir}>
			<option value="1">Ascending</option>
			<option value="-1">Descending</option>
		</select>
	</section>
}