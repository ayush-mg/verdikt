const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model.js')
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existinguser = await User.findOne({ email })
        if (existinguser) {
            return res.status(400).json({ message: 'UserAlreadyExists' })
        }
        const salt = await bcrypt.genSalt(12)
        const passwordhash = await bcrypt.hash(password, salt)
        const newuser = new User({
            username,
            email,
            passwordhash
        })
        const saveduser = await newuser.save()
        const token = jwt.sign({ userid: saveduser.id }, process.env.JWTSECRET, { expiresIn: '7d' })
        res.status(201).json({ token, user: { username: saveduser.username, email: saveduser.email } })
    } catch (error) {
        res.status(500).json({ message: 'ServerError' })
    }
})
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'InvalidCredentials' })
        }
        const ismatch = await bcrypt.compare(password, user.passwordhash)
        if (!ismatch) {
            return res.status(400).json({ message: 'InvalidCredentials' })
        }
        const token = jwt.sign({ userid: user.id }, process.env.JWTSECRET, { expiresIn: '7d' })
        res.status(200).json({ token, user: { username: user.username, email: user.email } })
    } catch (error) {
        res.status(500).json({ message: 'ServerError' })
    }
})
module.exports = router