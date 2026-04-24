const express=require('express')
const router=express.Router()
const Submission=require('../models/Submission.model.js')
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
module.exports=router