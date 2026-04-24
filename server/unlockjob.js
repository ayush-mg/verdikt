const cron=require('node-cron')
const Submission=require('./models/Submission.model.js')
const calculatemerit=require('./services/meritcalculator.js')
const startcron=()=>{
	cron.schedule('0 * * * *',async()=>{
		const now=new Date()
		const expiredsubmissions=await Submission.find({status:'under_review',unlocksat:{$lte:now}})
		for(let sub of expiredsubmissions){
			await calculatemerit(sub.id)
		}
	})
}
module.exports=startcron