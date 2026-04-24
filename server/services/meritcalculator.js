const User=require('../models/User.model.js')
const Submission=require('../models/Submission.model.js')
const Judgment=require('../models/Judgment.model.js')
const calculatemerit=async(submissionid)=>{
	const judgments=await Judgment.find({submissionid})
	if(judgments.length===0)return
	let totalscore=0
	const verdictweights={elegant:5,solid:4,needswork:3,confusing:2,incomplete:1}
	judgments.forEach(j=>{
		totalscore+=verdictweights[j.verdict]||0
	})
	const avgscore=totalscore/judgments.length
	const submission=await Submission.findById(submissionid)
	submission.aggregatedscore=avgscore
	submission.status='completed'
	await submission.save()
	const submitter=await User.findById(submission.submitterid)
	submitter.submissionmeritscore=((submitter.submissionmeritscore*submitter.totalsubmissions)+avgscore)/(submitter.totalsubmissions+1)
	submitter.totalsubmissions+=1
	submitter.submissionmerithistory.push({score:submitter.submissionmeritscore,date:new Date()})
	await submitter.save()
}
module.exports=calculatemerit