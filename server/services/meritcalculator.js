const User=require('../models/User.model.js')
const Submission=require('../models/Submission.model.js')
const Judgment=require('../models/Judgment.model.js')

const MIN_JUDGES=3 // Minimum judgments before a submission is finalized

const calculatemerit=async(submissionid)=>{
	const submission=await Submission.findById(submissionid)
	if(!submission)return
	// Don't re-finalize already completed submissions
	if(submission.status==='completed')return

	const judgments=await Judgment.find({submissionid})
	if(judgments.length===0)return

	// Only finalize once we hit the minimum threshold
	if(judgments.length<MIN_JUDGES)return

	const verdictweights={elegant:5,solid:4,needswork:3,confusing:2,incomplete:1}
	let totalscore=0
	judgments.forEach(j=>{
		totalscore+=verdictweights[j.verdict]||0
	})
	const avgscore=totalscore/judgments.length

	// Update submission — mark completed with aggregated score
	submission.aggregatedscore=avgscore
	submission.status='completed'
	await submission.save()

	// Update submitter's merit score (totalsubmissions already incremented at submission creation)
	const submitter=await User.findById(submission.submitterid)
	if(submitter){
		// Running average: (currentAvg * (n-1) + newScore) / n
		const n=submitter.totalsubmissions||1
		const currenttotal=submitter.submissionmeritscore*(n-1)
		submitter.submissionmeritscore=(currenttotal+avgscore)/n
		submitter.submissionmerithistory.push({score:avgscore,date:new Date()})
		await submitter.save()
	}

	// Reward all judges who participated
	for(const judgment of judgments){
		const judge=await User.findById(judgment.judgeid)
		if(judge){
			const judgmentreward=2+(verdictweights[judgment.verdict]||0)*0.5
			const n=judge.totaljudged||1
			const currenttotal=judge.judgmentmeritscore*(n-1)
			judge.judgmentmeritscore=(currenttotal+judgmentreward)/n
			judge.judgmentmerithistory.push({score:judgmentreward,date:new Date()})
			await judge.save()
		}
	}
}
module.exports=calculatemerit