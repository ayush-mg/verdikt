import{useState,useEffect}from'react'
import axiosinstance from'../api/axios.js'
const Leaderboard=()=>{
	const[users,setusers]=useState([])
	useEffect(()=>{
		const fetchleaderboard=async()=>{
			try{
				const res=await axiosinstance.get('/users/leaderboard')
				setusers(res.data)
			}catch(error){
				console.log(error)
			}
		}
		fetchleaderboard()
	},[])
	return(
		<div>
			<h2>Global Leaderboard</h2>
			<ol>
				{users.map((user)=>(
					<li key={user.id}>
						{user.username} - Merit Score: {user.submissionmeritscore||0}
					</li>
				))}
			</ol>
		</div>
	)
}
export default Leaderboard