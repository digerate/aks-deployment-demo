const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Assuming JWT is used for tokens

exports.register = async (req, res) => {
    console.log('Registering user', req.body); // Log the incoming registration attempt

    try {
        // Basic validation
        if (!req.body.email || !req.body.password) {
            const error = new Error("Email and password are required.");
            error.isOperational = true;
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            const error = new Error("User already exists.");
            error.isOperational = true;
            error.statusCode = 409;
            throw error;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create new user
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username, // Assuming username is part of the user model
        });

        await user.save();

        // Successfully registered
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error('Registration error', error); // Log any errors that occur during registration
        if (error.isOperational) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: "An error occurred during registration." });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: "Authentication failed. User not found." });
        }

        // Verify password
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Authentication failed. Incorrect password." });
        }

        // Generate a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Successfully logged in
        res.json({ message: "Login successful", token: token });
    } catch (error) {
        console.error('Login error', error); // Log any errors that occur during login
        res.status(500).json({ message: "An error occurred during login." });
    }
};
