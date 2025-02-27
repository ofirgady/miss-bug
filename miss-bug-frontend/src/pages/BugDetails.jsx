import { useState } from 'react'
import { bugService } from '../services/bug'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        loadBug()
    }, [])

    async function loadBug() {
        try {
            const bug = await bugService.getById(bugId)
            setBug(bug)
        } catch (err) {
            showErrorMsg('Cannot load bug')

        }
    }

    if (!bug) return <h1>loadings....</h1>
    return <div className="bug-details main-layout">
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Description: <span>{bug.description}</span></p>
        <p>Created At: <span>{new Date(bug.createdAt).toLocaleDateString()}</span></p>
        <p>Updated At: <span>{new Date(bug.updatedAt).toLocaleDateString()}</span></p>
        <p>Creator: <span>{bug.creator.fullname}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>

}

