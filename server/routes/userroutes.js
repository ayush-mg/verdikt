const express=require('express')
const router=express.Router()
const User=require('../models/User.model.js')
const authmiddleware=require('../middleware/authmiddleware.js')

// Leaderboard: ranked by submission merit score only
router.get('/leaderboard',authmiddleware,async(req,res)=>{
	try{
		const users=await User.find({totalsubmissions:{$gt:0}})
			.sort({submissionmeritscore:-1})
			.limit(20)
			.select('username submissionmeritscore totalsubmissions createdAt')
		res.status(200).json(users)
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})

// Profile: current user's full stats
router.get('/profile',authmiddleware,async(req,res)=>{
	try{
		const user=await User.findById(req.user.userid).select('-passwordhash')
		res.status(200).json(user)
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})

module.exports=router