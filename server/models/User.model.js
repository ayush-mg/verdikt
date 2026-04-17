const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
	username:{type:String,required:true,unique:true},
	email:{type:String,required:true,unique:true},
	passwordhash:{type:String,required:true},
	avatarurl:{type:String},
	submissionmeritscore:{type:Number,default:0},
	judgmentmeritscore:{type:Number,default:0},
	submissionmerithistory:[{score:Number,date:Date}],
	judgmentmerithistory:[{score:Number,date:Date}],
	totalsubmissions:{type:Number,default:0},
	totaljudged:{type:Number,default:0},
	preferredcategories:[{type:String}],
	createdat:{type:Date,default:Date.now}
},{timestamps:true});
module.exports=mongoose.model('User',userschema);