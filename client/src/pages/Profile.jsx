import{useState,useEffect}from'react'
import axiosinstance from'../api/axios.js'
const Profile=()=>{
	const[userprofile,setuserprofile]=useState(null)
	useEffect(()=>{
		const fetchprofile=async()=>{
			try{
				const res=await axiosinstance.get('/users/profile')
				setuserprofile(res.data)
			}catch(error){
				console.log(error)
			}
		}
		fetchprofile()
	},[])
	if(!userprofile)return<p>Loading profile...</p>
	return(
		<div>
			<h2>My Profile</h2>
			<p><strong>Username:</strong> {userprofile.username}</p>
			<p><strong>Email:</strong> {userprofile.email}</p>
			<p><strong>Merit Score:</strong> {userprofile.submissionmeritscore||0}</p>
			<p><strong>Total Submissions:</strong> {userprofile.totalsubmissions||0}</p>
		</div>
	)
}
export default Profile