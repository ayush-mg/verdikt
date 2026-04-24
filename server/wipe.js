require('dotenv').config()
const mongoose=require('mongoose')
const User=require('./models/User.model.js')
const Submission=require('./models/Submission.model.js')
const Judgment=require('./models/Judgment.model.js')

const wipeData = async () => {
	try {
		await mongoose.connect(process.env.MONGOURI)
		console.log('Connected to Database...')
		
		await User.deleteMany({})
		await Submission.deleteMany({})
		await Judgment.deleteMany({})
		
		console.log('Success: All users, submissions, and judgments wiped clean!')
		process.exit(0)
	} catch (error) {
		console.log('Error wiping data:', error)
		process.exit(1)
	}
}

wipeData()