// Step 1 - Task 2: Import necessary packages
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const connectToDatabase = require('../models/db');
const pino = require('pino');
const { body, validationResult } = require('express-validator');

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

router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Access the users collection
        const collection = db.collection("users");

        const { email, password } = req.body;

        // Task 3: Check if user exists
        const user = await collection.findOne({ email });

        // Task 7: If user not found
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Task 4: Check password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Task 6: Generate JWT
        const authtoken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Task 5: Send user info and token
        return res.json({
            authtoken,
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email
        });
    } catch (e) {
        return res.status(500).send('Internal server error');
    }
});

router.put('/update',
  // Input validation rules
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Task 2: Return if validation fails
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Task 3: Check for email in header
      const email = req.headers.email;
      if (!email) {
        return res.status(400).json({ message: 'Email is required in the headers' });
      }

      // Task 4: Connect to DB
      const db = await connectToDatabase();
      const usersCollection = db.collection("users");

      // Task 5: Find user
      const existingUser = await usersCollection.findOne({ email });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Task 6: Update user
      const updatedFields = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: await bcryptjs.hash(req.body.password, 10),
        updatedAt: new Date()
      };

      await usersCollection.updateOne({ email }, { $set: updatedFields });

      // Task 7: Return new token
      const authtoken = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ authtoken });
    } catch (e) {
      return res.status(500).send('Internal server error');
    }
  }
);


module.exports = router;
