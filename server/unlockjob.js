const cron=require('node-cron')
const Submission=require('./models/Submission.model.js')
const calculatemerit=require('./services/meritcalculator.js')

const startcron=()=>{
	// Run every 30 minutes to catch 48-hour expired submissions
	cron.schedule('*/30 * * * *',async()=>{
		try{
			const now=new Date()
			// Find all under_review submissions whose 48-hour window has expired
			const expiredsubmissions=await Submission.find({
				status:'under_review',
				unlocksat:{$lte:now}
			})
			console.log(`[Cron] Checking expired submissions: found ${expiredsubmissions.length}`)
			for(let sub of expiredsubmissions){
				await calculatemerit(sub._id)
			}
		}catch(err){
			console.error('[Cron] Error processing expired submissions:',err)
		}
	})
}
module.exports=startcron