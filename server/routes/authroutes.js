const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const User=require('../models/User.model.js')
router.post('/register',async(req,res)=>{
	try{
		const{username,email,password}=req.body
		if(!username||!email||!password){
			return res.status(400).json({message:'All fields required'})
		}
		const existinguser=await User.findOne({$or:[{email},{username}]})
		if(existinguser){
			return res.status(400).json({message:'Username or Email already in use'})
		}
		const salt=await bcrypt.genSalt(10)
		const hashedpassword=await bcrypt.hash(password,salt)
		const newuser=new User({username,email,passwordhash:hashedpassword})
		await newuser.save()
		res.status(201).json({message:'User registered successfully'})
	}catch(error){
		res.status(500).json({message:error.message})
	}
})
router.post('/login',async(req,res)=>{
	try{
		const{email,password}=req.body
		const user=await User.findOne({email})
		if(!user){
			return res.status(400).json({message:'Invalid credentials'})
		}
		const ismatch=await bcrypt.compare(password,user.passwordhash)
		if(!ismatch){
			return res.status(400).json({message:'Invalid credentials'})
		}
		const jwtsecret=process.env.JWTSECRET||'defaultsecret'
		const token=jwt.sign({userid:user.id},jwtsecret,{expiresIn:'1d'})
		res.status(200).json({token,user:{id:user.id,username:user.username,email:user.email}})
	}catch(error){
		res.status(500).json({message:error.message})
	}
})
module.exports=router