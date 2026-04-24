import{useState,useEffect}from'react'
import axiosinstance from'../api/axios.js'
import{Link}from'react-router-dom'
const Dashboard=()=>{
	const[mysubmissions,setmysubmissions]=useState([])
	useEffect(()=>{
		const fetchsubmissions=async()=>{
			try{
				const res=await axiosinstance.get('/submissions/my')
				setmysubmissions(res.data)
			}catch(error){
				console.log(error)
			}
		}
		fetchsubmissions()
	},[])
	return(
		<div>
			<h1>Dashboard</h1>
			<Link to="/submit">Submit New Work</Link>
			<ul>
				{mysubmissions.map((sub)=>(
					<li key={sub.id}>
						{sub.type} - {sub.category} - Status: {sub.status}
					</li>
				))}
			</ul>
		</div>
	)
}
export default Dashboard