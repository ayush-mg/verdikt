import{useState,useContext}from'react'
import{AuthContext}from'../context/AuthContext.jsx'
import axiosinstance from'../api/axios.js'
const Register=()=>{
	const[username,setusername]=useState('')
	const[email,setemail]=useState('')
	const[password,setpassword]=useState('')
	const{login}=useContext(AuthContext)
	const handlesubmit=async(e)=>{
		e.preventDefault()
		try{
			const res=await axiosinstance.post('/auth/register',{username,email,password})
			login(res.data.user,res.data.token)
		}catch(error){
			console.log(error)
		}
	}
	return(
		<form onSubmit={handlesubmit}>
			<input type="text" value={username} onChange={(e)=>setusername(e.target.value)} required/>
			<input type="email" value={email} onChange={(e)=>setemail(e.target.value)} required/>
			<input type="password" value={password} onChange={(e)=>setpassword(e.target.value)} required/>
			<button type="submit">Register</button>
		</form>
	)
}
export default Register