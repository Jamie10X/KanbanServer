// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const sauce = process.env.sauce;

// Sign-up route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(403).json({ message: 'Username is already taken' });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(403).json({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error during signup process:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Sign-in route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords
        if (!isMatch) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, sauce, { expiresIn: '5h' });
        res.status(200).json({ token, user: user.username });
    } catch (error) {
        console.error('Error during signin process:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
