const User=require('../models/User.model.js')
const assignjudges=async(submitterid,category)=>{
	const eligibleusers=await User.find({_id:{$ne:submitterid}})
	const shuffled=eligibleusers.sort(()=>0.5-Math.random())
	const selected=shuffled.slice(0,3)
	return selected.map(user=>user._id)
}
module.exports=assignjudges