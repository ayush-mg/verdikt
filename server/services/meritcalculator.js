const User=require('../models/User.model.js')
const Submission=require('../models/Submission.model.js')
const Judgment=require('../models/Judgment.model.js')

const REQUIRED_JUDGES=5

const calculatemerit=async(submissionid)=>{
	const submission=await Submission.findById(submissionid)
	if(!submission)return
	// Don't re-process already completed submissions
	if(submission.status==='completed')return

	const judgments=await Judgment.find({submissionid})
	if(judgments.length===0)return

	const verdictweights={elegant:5,solid:4,needswork:3,confusing:2,incomplete:1}
	let totalscore=0
	judgments.forEach(j=>{
		totalscore+=verdictweights[j.verdict]||0
	})
	const runningavg=totalscore/judgments.length

	// Always update the running average on the submission document
	submission.aggregatedscore=runningavg

	// Finalize if 5 judgments reached OR 48-hour window has passed
	const now=new Date()
	const expired=submission.unlocksat&&submission.unlocksat<=now
	if(judgments.length>=REQUIRED_JUDGES||expired){
		submission.status='completed'
	}
	await submission.save()

	// Recompute submitter's overall merit score as average of ALL their submissions' running scores
	const submitter=await User.findById(submission.submitterid)
	if(submitter){
		const allsubmissions=await Submission.find({
			submitterid:submission.submitterid,
			aggregatedscore:{$ne:null,$exists:true}
		})
		if(allsubmissions.length>0){
			const totaluserscore=allsubmissions.reduce((sum,s)=>sum+(s.aggregatedscore||0),0)
			submitter.submissionmeritscore=totaluserscore/allsubmissions.length
			await submitter.save()
		}
	}
}
module.exports=calculatemerit