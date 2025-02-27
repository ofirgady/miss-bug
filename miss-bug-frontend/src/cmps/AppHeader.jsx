
import { Link, NavLink } from 'react-router-dom'
import { LoginSignup } from "./LoginSignup.jsx"
import { userService } from '../services/user'
import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"


export function AppHeader() {
	// Will be in the store in the future~~
	const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

	async function onLogin(credentials) {
		console.log(credentials)
		try {
			const user = await userService.login(credentials)
			setLoggedinUser(user)
		} catch (err) {
			console.log('Cannot login :', err)
			showErrorMsg(`Cannot login`)
		}
	}

	async function onSignup(credentials) {
		console.log(credentials)
		try {
			const user = await userService.signup(credentials)
			setLoggedinUser(user)
			showSuccessMsg(`Welcome ${user.fullname}`)
		} catch (err) {
			console.log('Cannot signup :', err)
			showErrorMsg(`Cannot signup`)
		}
		// add signup
	}

	async function onLogout() {
		try {
			await userService.logout()
			setLoggedinUser(null)
		} catch (err) {
			console.log('can not logout')
		}
		// add logout
	}

	return (
		<header className='app-header '>
			<div className='header-container'>
      <Link to='/'><h1>Miss Bug</h1></Link>
				<section className='login-signup-container'>
					{!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

					{loggedinUser && (
						<div className='user-preview'>
							<h3>Hello {loggedinUser.fullname}</h3>
							<button onClick={onLogout}>Logout</button>
						</div>
					)}
				</section>
				<nav className='app-nav'>
					<NavLink to='/'>Home</NavLink>
          <NavLink to='/bug'>Bugs</NavLink> 
					<NavLink to='/about'>About</NavLink> 
          {loggedinUser && <NavLink to={`/profile/${loggedinUser._id}`}>Profile</NavLink>}
				</nav>
			</div>
		</header>
	)
}
