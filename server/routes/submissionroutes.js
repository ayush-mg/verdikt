const express=require('express')
const router=express.Router()
const Submission=require('../models/Submission.model.js')
const Judgment=require('../models/Judgment.model.js')
const{upload,cloudinary}=require('../utils/cloudinary.js')
const authmiddleware=require('../middleware/authmiddleware.js')

// POST /submissions — Create new submission
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
		// Set 48-hour expiry window
		const unlocksat=new Date(Date.now()+48*60*60*1000)
		const newsubmission=new Submission({
			submitterid:req.user.userid,
			type,
			category,
			contenttext,
			contenturl:finalurl,
			assignedjudgeids:[],
			status:'under_review',
			unlocksat
		})
		const savedsubmission=await newsubmission.save()
		// Increment submitter's total submission count
		await require('../models/User.model.js').findByIdAndUpdate(req.user.userid,{$inc:{totalsubmissions:1}})
		res.status(201).json(savedsubmission)
	}catch(error){
		console.error(error)
		res.status(500).json({message:'ServerError',error:error.message})
	}
})

// GET /submissions/my — Get current user's own submissions
router.get('/my',authmiddleware,async(req,res)=>{
	try{
		const mysubmissions=await Submission.find({submitterid:req.user.userid}).sort({createdAt:-1})
		res.status(200).json(mysubmissions)
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})

// GET /submissions/queue — All under_review submissions not submitted by or already judged by user
router.get('/queue',authmiddleware,async(req,res)=>{
	try{
		const alreadyjudged=await Judgment.find({judgeid:req.user.userid}).select('submissionid')
		const judgedids=alreadyjudged.map(j=>j.submissionid.toString())
		const queue=await Submission.find({
			submitterid:{$ne:req.user.userid},
			status:'under_review',
			_id:{$nin:judgedids}
		}).sort({createdAt:-1})
		res.status(200).json(queue)
	}catch(error){
		console.error(error)
		res.status(500).json({message:'ServerError'})
	}
})

// GET /submissions/:id/status — Submitter detail view with live judgment data
router.get('/:id/status',authmiddleware,async(req,res)=>{
	try{
		const submission=await Submission.findById(req.params.id)
		if(!submission)return res.status(404).json({message:'NotFound'})
		// Only the submitter can access the status detail view
		if(submission.submitterid.toString()!==req.user.userid.toString()){
			return res.status(403).json({message:'Forbidden'})
		}
		// Get anonymized judgment data (no judge identity)
		const judgments=await Judgment.find({submissionid:req.params.id}).select('-judgeid')
		const now=new Date()
		const timeremaining=submission.unlocksat?Math.max(0,submission.unlocksat-now):null
		res.status(200).json({
			submission,
			judgments,
			judgmentcount:judgments.length,
			timeremaining,
			currentavg:submission.aggregatedscore||null
		})
	}catch(error){
		console.error(error)
		res.status(500).json({message:'ServerError'})
	}
})

// GET /submissions/:id — Get single submission (any logged-in user, for judge preview)
router.get('/:id',authmiddleware,async(req,res)=>{
	try{
		const submission=await Submission.findById(req.params.id)
		if(!submission)return res.status(404).json({message:'NotFound'})
		res.status(200).json(submission)
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})

// GET /submissions/:id/feedback — Full feedback after completion
router.get('/:id/feedback',authmiddleware,async(req,res)=>{
	try{
		const submission=await Submission.findById(req.params.id)
		if(!submission)return res.status(404).json({message:'NotFound'})
		if(submission.status!=='completed'){
			return res.status(403).json({message:'FeedbackNotUnlocked'})
		}
		const judgments=await Judgment.find({submissionid:req.params.id}).select('-judgeid')
		res.status(200).json({submission,judgments})
	}catch(error){
		res.status(500).json({message:'ServerError'})
	}
})

module.exports=router