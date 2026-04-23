const mongoose = require('mongoose')
const userschema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	passwordhash: { type: String, required: true },
	avatarurl: { type: String, default: '' },
	submissionmeritscore: { type: Number, default: 0 },
	judgmentmeritscore: { type: Number, default: 0 },
	submissionmerithistory: [{ score: Number, date: { type: Date, default: Date.now } }],
	judgmentmerithistory: [{ score: Number, date: { type: Date, default: Date.now } }],
	totalsubmissions: { type: Number, default: 0 },
	totaljudged: { type: Number, default: 0 },
	preferredcategories: [{ type: String }]
}, { timestamps: true })
module.exports = mongoose.model('User', userschema)