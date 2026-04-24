import{useContext}from'react'
import{Link,useNavigate}from'react-router-dom'
import{AuthContext}from'../context/AuthContext.jsx'
const Navbar=()=>{
	const{token,logout}=useContext(AuthContext)
	const navigate=useNavigate()
	const handlelogout=()=>{
		logout()
		navigate('/login')
	}
	if(!token)return null
	return(
		<nav>
			<Link to="/">Dashboard</Link>
			<Link to="/submit">Submit Work</Link>
			<Link to="/queue">Judge Queue</Link>
			<Link to="/leaderboard">Leaderboard</Link>
			<Link to="/profile">Profile</Link>
			<button onClick={handlelogout}>Logout</button>
		</nav>
	)
}
export default Navbar