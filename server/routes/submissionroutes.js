const express=require('express')
const router=express.Router()
const Submission=require('../models/Submission.model.js')
const Judgment=require('../models/Judgment.model.js')
const{upload,cloudinary}=require('../utils/cloudinary.js')
const authmiddleware=require('../middleware/authmiddleware.js')
const assignjudges=require('../services/matchingalgorithm.js')
router.post('/',authmiddleware,upload.single('image'),async(req,res)=>{
	try{
		const{type,category,contenttext,contenturl}=req.body
		let finalurl=contenturl
		if(type==='image'&&req.file){
			const result=await new Promise((resolve,reject)=>{
				const stream=cloudinary.uploader.upload_stream({folder:'verdikt'},(error,result)=>{
					if(result)resolve(result)
					else reject(error)
				})
				stream.end(req.file.buffer)
			})
			finalurl=result.secure_url
		}
		const selectedjudges=await assignjudges(req.user.userid,category)
		const newsubmission=new Submission({
			submitterid:req.user.userid,
			type,
			category,
			contenttext,
			contenturl:finalurl,
			assignedjudgeids:selectedjudges,
			status:selectedjudges.length>0?'under_review':'pending_assignment'
		})
		const savedsubmission=await newsubmission.save()
		await require('../models/User.model.js').findByIdAndUpdate(req.user.userid,{$inc:{totalsubmissions:1}})
		res.status(201).json(savedsubmission)
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})
router.get('/my',authmiddleware,async(req,res)=>{
	try{
		const mysubmissions=await Submission.find({submitterid:req.user.userid})
		res.status(200).json(mysubmissions)
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})
router.get('/queue',authmiddleware,async(req,res)=>{
	try{
		// Find IDs of submissions this user has already judged
		const alreadyjudged=await Judgment.find({judgeid:req.user.userid}).select('submissionid')
		const judgedids=alreadyjudged.map(j=>j.submissionid.toString())

		// Show all under_review submissions where:
		// 1. Current user is NOT the submitter
		// 2. Current user has NOT already judged it
		const queue=await Submission.find({
			submitterid:{$ne:req.user.userid},
			status:'under_review',
			_id:{$nin:judgedids}
		})
		res.status(200).json(queue)
	}catch(error){
		console.error(error)
		res.status(500).json({message:'ServerError'})
	}
})
router.get('/:id',authmiddleware,async(req,res)=>{
	try{
		const submission=await Submission.findById(req.params.id)
		if(!submission) return res.status(404).json({message:'NotFound'})
		res.status(200).json(submission)
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})
router.get('/:id/feedback',authmiddleware,async(req,res)=>{
	try{
		const submission=await Submission.findById(req.params.id)
		if(!submission) return res.status(404).json({message:'NotFound'})
		if(submission.status!=='completed'){
			return res.status(403).json({message:'FeedbackNotUnlocked'})
		}
		const judgments=await Judgment.find({submissionid:req.params.id})
		res.status(200).json({submission,judgments})
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})
module.exports=router