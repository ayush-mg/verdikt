const mongoose=require('mongoose')
const judgmentschema=new mongoose.Schema({
	submissionid:{type:mongoose.Schema.Types.ObjectId,ref:'Submission',required:true},
	judgeid:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
	verdict:{type:String,enum:['elegant','solid','needswork','confusing','incomplete'],required:true},
	review:{type:String,required:true,maxlength:800}
},{timestamps:true})
module.exports=mongoose.model('Judgment',judgmentschema)