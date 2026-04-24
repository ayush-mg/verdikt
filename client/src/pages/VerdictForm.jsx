import{useState}from'react'
import axiosinstance from'../api/axios.js'
import{useParams,useNavigate}from'react-router-dom'
const VerdictForm=()=>{
	const{id}=useParams()
	const navigate=useNavigate()
	const[verdict,setverdict]=useState('solid')
	const[review,setreview]=useState('')
	const handlesubmit=async(e)=>{
		e.preventDefault()
		try{
			await axiosinstance.post('/judgments',{submissionid:id,verdict,review})
			navigate('/queue')
		}catch(error){
			console.log(error)
		}
	}
	return(
		<form onSubmit={handlesubmit}>
			<h2>Submit Verdict</h2>
			<select value={verdict} onChange={(e)=>setverdict(e.target.value)}>
				<option value="elegant">Elegant</option>
				<option value="solid">Solid</option>
				<option value="needswork">Needs Work</option>
				<option value="confusing">Confusing</option>
				<option value="incomplete">Incomplete</option>
			</select>
			<textarea value={review} onChange={(e)=>setreview(e.target.value)} maxLength="800" required/>
			<button type="submit">Submit Judgment</button>
		</form>
	)
}
export default VerdictForm