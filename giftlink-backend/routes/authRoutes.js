// Step 1 - Task 2: Import necessary packages
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const connectToDatabase = require('../models/db');
const pino = require('pino');

// Step 1 - Task 3: Create a Pino logger instance
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

dotenv.config();

// Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Placeholder for POST /register route (filled in next step)
router.post('/register', async (req, res) => {
    // Will be implemented in Step 2
    router.post('/register', async (req, res) => {
        try {
            const db = await connectToDatabase();
            const collection = db.collection("users");

            const { firstName, lastName, email, password } = req.body;

            // Check if user already exists
            const existingUser = await collection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcryptjs.hash(password, 10);

            const newUser = {
                firstName,
                lastName,
                email,
                password: hashedPassword
            };

            // Insert new user
            await collection.insertOne(newUser);

            // Generate JWT token
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

            logger.info(`User registered: ${email}`);
            res.status(201).json({ token });
        } catch (error) {
            logger.error("Error during registration: " + error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
});

module.exports = router;
