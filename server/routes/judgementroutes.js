const express=require('express')
const router=express.Router()
const Judgment=require('../models/Judgment.model.js')
const Submission=require('../models/Submission.model.js')
const User=require('../models/User.model.js')
const authmiddleware=require('../middleware/authmiddleware.js')
const calculatemerit=require('../services/meritcalculator.js')

router.post('/',authmiddleware,async(req,res)=>{
	try{
		const{submissionid,verdict,review}=req.body
		const submission=await Submission.findById(submissionid)
		if(!submission){
			return res.status(404).json({message:'NotFound'})
		}
		if(submission.submitterid.toString()===req.user.userid.toString()){
			return res.status(403).json({message:'CannotJudgeOwnWork'})
		}
		
		// Check if judge has already judged this submission
		const existingjudgment=await Judgment.findOne({
			submissionid:submissionid,
			judgeid:req.user.userid
		})
		if(existingjudgment){
			return res.status(403).json({message:'AlreadyJudged'})
		}
		
		const newjudgment=new Judgment({
			submissionid,
			judgeid:req.user.userid,
			verdict,
			review
		})
		await newjudgment.save()
		
		// Track this judge in assignedjudgeids if not already there
		if(!submission.assignedjudgeids.some(id=>id.toString()===req.user.userid.toString())){
			submission.assignedjudgeids.push(req.user.userid)
		}
		
		submission.judgmentcount+=1
		await submission.save()
		
		// Update judge's stats
		const judge=await User.findByIdAndUpdate(req.user.userid,
			{$inc:{totaljudged:1}},
			{new:true}
		)
		
		// Call merit calculator
		await calculatemerit(submissionid)
		
		res.status(201).json(newjudgment)
	}catch(error){
		console.error(error)
		res.status(500).json({message:'ServerError',error:error.message})
	}
})
module.exports=router