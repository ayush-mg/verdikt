import{useState}from'react'
import axiosinstance from'../api/axios.js'
import{useNavigate}from'react-router-dom'
const SubmitWork=()=>{
	const[type,settype]=useState('code')
	const[category,setcategory]=useState('frontend')
	const[contenttext,setcontenttext]=useState('')
	const[file,setfile]=useState(null)
	const[contenturl,setcontenturl]=useState('')
	const navigate=useNavigate()
	const handlesubmit=async(e)=>{
		e.preventDefault()
		try{
			const formdata=new FormData()
			formdata.append('type',type)
			formdata.append('category',category)
			if(type==='image'&&file){
				formdata.append('image',file)
			}else if(type==='code'||type==='text'){
				formdata.append('contenttext',contenttext)
			}else if(type==='url'){
				formdata.append('contenturl',contenturl)
			}
			await axiosinstance.post('/submissions',formdata)
			navigate('/')
		}catch(error){
			console.log(error)
		}
	}
	return(
		<form onSubmit={handlesubmit}>
			<select value={type} onChange={(e)=>settype(e.target.value)}>
				<option value="code">Code</option>
				<option value="text">Text</option>
				<option value="image">Image</option>
				<option value="url">URL</option>
			</select>
			<select value={category} onChange={(e)=>setcategory(e.target.value)}>
				<option value="frontend">Frontend</option>
				<option value="backend">Backend</option>
				<option value="design">Design</option>
				<option value="writing">Writing</option>
				<option value="logic">Logic</option>
			</select>
			{type==='image'?<input type="file" onChange={(e)=>setfile(e.target.files[0])} required/>:type==='url'?<input type="url" value={contenturl} onChange={(e)=>setcontenturl(e.target.value)} required/>:<textarea value={contenttext} onChange={(e)=>setcontenttext(e.target.value)} required/>}
			<button type="submit">Submit</button>
		</form>
	)
}
export default SubmitWork