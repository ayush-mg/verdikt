const cloudinary=require('cloudinary').v2
const multer=require('multer')
cloudinary.config({
cloud_name:process.env.CLOUDINARYNAME,
api_key:process.env.CLOUDINARYAPIKEY,
api_secret:process.env.CLOUDINARYAPISECRET
})
const storage=multer.memoryStorage()
const upload=multer({storage})
module.exports={cloudinary,upload}