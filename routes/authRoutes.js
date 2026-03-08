const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const UserValidation = require('../validation/userValidation'); // Import the bouncer
const { protect } = require('../middleware/authMiddleware'); // Import the security guard

// 1. REGISTER NEW USER
router.post('/register', async (req, res) => {
    // A. Ask Joi to check the data first (Name, Email, Password)
    const { error } = UserValidation.validate(req.body);
    
    // B. If Joi finds a mistake, stop here and tell the user why
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body; // Removed role

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Scramble (Hash) password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
        // Role is gone!
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// 2. LOGIN USER
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// 3. DELETE USER ACCOUNT
router.delete('/delete-me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.user.id);
        
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;