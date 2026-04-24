import{useState,useEffect}from'react'
import axiosinstance from'../api/axios.js'
import{useParams}from'react-router-dom'
const FeedbackReveal=()=>{
	const{id}=useParams()
	const[feedbackdata,setfeedbackdata]=useState(null)
	useEffect(()=>{
		const fetchfeedback=async()=>{
			try{
				const res=await axiosinstance.get(`/submissions/${id}/feedback`)
				setfeedbackdata(res.data)
			}catch(error){
				console.log(error)
			}
		}
		fetchfeedback()
	},[id])
	if(!feedbackdata)return<p>Loading or not unlocked yet...</p>
	return(
		<div>
			<h2>Feedback Reveal</h2>
			<p>Aggregated Score: {feedbackdata.submission.aggregatedscore}</p>
			<ul>
				{feedbackdata.judgments.map((j,index)=>(
					<li key={index}>
						<strong>Verdict:</strong> {j.verdict}
						<p>{j.review}</p>
					</li>
				))}
			</ul>
		</div>
	)
}
export default FeedbackReveal