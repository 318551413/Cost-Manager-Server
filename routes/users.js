// Route file: routes/users.js
// Purpose: Handles GET requests for user lists and specific user details, including total costs.
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');
const pino = require('pino');

// Create a logger object for event logging
const logger = pino();

// Endpoint to get a list of all users
router.get('/', function(req, res) {
    logger.info({ route: '/api/users', method: 'GET' }, 'Attempting to retrieve all users');
    User.find({})
        .then(function(users) {
            logger.info('Successfully retrieved all users');
            res.json(users);
        })
        .catch(function(err) {
            logger.error({ error: err.message }, 'Failed to retrieve users');
            res.status(500).json({ error: 'Failed to retrieve users', details: err.message });
        });
});

// Endpoint to get a specific user's details and total costs using aggregation
router.get('/:id', function(req, res) {
    const userId = parseInt(req.params.id);
    logger.info({ route: '/api/users/:id', method: 'GET', userId }, 'Attempting to retrieve user details and total costs');

    // Use a MongoDB aggregation pipeline to find a user and calculate the sum of their costs
    User.aggregate([
        { $match: { id: userId } },
        {
            $lookup: {
                from: 'costs',
                localField: 'id',
                foreignField: 'userid',
                as: 'userCosts'
            }
        },
        {
            // Stage 3: Project (shape) the final output document
            $project: {
                _id: 0,
                id: '$id',
                first_name: '$first_name',
                last_name: '$last_name',
                total: { $sum: '$userCosts.sum' }
            }
        }
    ])
        .then(function(result) {
            // Check if the aggregation returned a user (array is not empty)
            if (result.length === 0) {
                logger.warn({ userId }, 'User not found');
                return res.status(404).json({ error: 'User not found' });
            }
            logger.info({ userDetails: result[0] }, 'Successfully retrieved user details and total costs');
            res.json(result[0]);
        })
        .catch(function(err) {
            // Log the error and return a 500 status code for an internal server error.
            logger.error({ error: err.message }, 'Failed to retrieve user details and total costs');
            res.status(500).json({ error: 'Internal server error', details: err.message });
        });
});

module.exports = router;
