const express=require('express')
const router=express.Router()
const Judgment=require('../models/Judgment.model.js')
const Submission=require('../models/Submission.model.js')
const authmiddleware=require('../middleware/authmiddleware.js')
router.post('/',authmiddleware,async(req,res)=>{
	try{
		const{submissionid,verdict,review}=req.body
		const submission=await Submission.findById(submissionid)
		if(!submission){
			return res.status(404).json({message:'NotFound'})
		}
		if(submission.submitterid.toString()===req.user.userid){
			return res.status(403).json({message:'CannotJudgeOwnWork'})
		}
		const newjudgment=new Judgment({
			submissionid,
			judgeid:req.user.userid,
			verdict,
			review
		})
		await newjudgment.save()
		submission.judgmentcount+=1
		await submission.save()
		res.status(201).json(newjudgment)
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})
module.exports=router