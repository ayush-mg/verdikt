const mongoose=require('mongoose')
const submissionschema=new mongoose.Schema({
submitterid:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
type:{type:String,enum:['code','image','text','url'],required:true},
category:{type:String,enum:['frontend','backend','design','writing','logic'],required:true},
contenttext:{type:String},
contenturl:{type:String},
status:{type:String,enum:['pending_assignment','under_review','completed'],default:'pending_assignment'},
assignedjudgeids:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
judgmentcount:{type:Number,default:0},
aggregatedscore:{type:Number},
unlocksat:{type:Date}
},{timestamps:true})
module.exports=mongoose.model('Submission',submissionschema)