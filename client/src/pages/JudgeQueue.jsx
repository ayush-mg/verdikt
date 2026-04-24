import{useState,useEffect}from'react'
import axiosinstance from'../api/axios.js'
import{Link}from'react-router-dom'
const JudgeQueue=()=>{
	const[queue,setqueue]=useState([])
	useEffect(()=>{
		const fetchqueue=async()=>{
			try{
				const res=await axiosinstance.get('/submissions/queue')
				setqueue(res.data)
			}catch(error){
				console.log(error)
			}
		}
		fetchqueue()
	},[])
	return(
		<div>
			<h1>Judge Queue</h1>
			{queue.length===0?<p>No submissions to judge right now.</p>:null}
			<ul>
				{queue.map((sub)=>(
					<li key={sub.id}>
						{sub.type} - {sub.category}
						<Link to={`/judge/${sub.id}`}>Judge This</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
export default JudgeQueue