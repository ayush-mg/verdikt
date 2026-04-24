const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>{
	const token=req.header('Authorization')
	if(!token)return res.status(401).json({message:'NoToken'})
	try{
		const decoded=jwt.verify(token.replace('Bearer ',''),process.env.JWTSECRET)
		req.user=decoded
		next()
	}catch(error){
		res.status(401).json({message:'InvalidToken'})
	}
}