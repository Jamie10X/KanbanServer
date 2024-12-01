const express = require('express');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const sauce = process.env.sauce;

router.post('/signup', async (req,res)=>{
    const {username, email, password} = req.body;
    try {
        const check = await User.findOne({username:username});
        if(check) return res.status(403).json({message:'username is busy'});
        const mail = await User.findOne({email:email});
        if(mail) return res.status(403).json({message:'email is registered'});

        const user = new User({
            username,
            email,
            password
        });
        await user.save();
        res.status(200).json({message:'success'});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:'something happened while signing up'});
    }
});

router.post('/signin', async (req,res)=>{
    const {password, email} = req.body;
    try {
        const user = await User.findOne({email:email});
        if (!user) return res.status(404).json({message:'User does not exist'});
        if (user.password !== password) return res.status(403).json({message:'password incorrect'});
        const id = user.username;
        const token = jwt.sign({id:id}, sauce, {expiresIn:'5h'});
        res.status(200).json({token:token, user:id});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'something happened while signing in'});
    }
});

module.exports = router;