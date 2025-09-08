// File: routes/add.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');
const pino = require('pino');

const logger = pino();

router.post('/', async (req, res) => {
    try {
        const { id, first_name, last_name, birthday, userid, description, sum, category, date } = req.body;

        // Validation check and user addition
        if (id) {
            const userExists = await User.findOne({ id });
            if (userExists) {
                logger.error(`Failed to add user, ID already exists: ${id}`);
                return res.status(409).json({ error: 'User ID already exists' });
            }
            const newUser = new User({ id, first_name, last_name, birthday });
            await newUser.save();
            logger.info(`User added successfully: ${id}`);
            return res.status(201).json(newUser);
        }

        // Validation check and cost addition
        if (userid && description && sum && category) {
            const userExists = await User.findOne({ id: userid });
            if (!userExists) {
                logger.error(`Failed to add cost, user not found: ${userid}`);
                return res.status(404).json({ error: 'User not found' });
            }

            // Date validation
            const costDate = date ? new Date(date) : new Date();
            const now = new Date();

            // Compare date to ensure it is not in the past
            const isPast = costDate.getFullYear() < now.getFullYear() ||
                (costDate.getFullYear() === now.getFullYear() && costDate.getMonth() < now.getMonth()) ||
                (costDate.getFullYear() === now.getFullYear() && costDate.getMonth() === now.getMonth() && costDate.getDate() < now.getDate());

            if (isPast) {
                logger.warn(`Attempt to add cost in the past: ${costDate}`);
                return res.status(400).json({ error: 'Cannot add a cost for a past date' });
            }

            const newCost = new Cost({
                userid,
                description,
                sum,
                category,
                date: costDate
            });

            await newCost.save();
            logger.info(`Cost added successfully for user: ${userid}`);
            return res.status(201).json(newCost);
        }

        logger.warn('Failed to add item, invalid parameters');
        return res.status(400).json({ error: 'Invalid parameters' });

    } catch (e) {
        logger.error('Failed to add item', { error: e.message });
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
