// routes/about.
const express = require('express');
const router = express.Router();
const pino = require('pino');
// Create a logger instance for logging.
const logger = pino();

router.get('/', function(req, res) {
    logger.info({ route: '/api/about', method: 'GET' }, 'Attempting to retrieve developers team details');
    // Define an array of objects, where each object represents a team member.
    const teamMembers = [
        { first_name: 'Inbal', last_name: 'Keinan' },
        { first_name: 'Nadav', last_name: 'Keinan' }
    ];
    // Send the `teamMembers` array as a JSON response.
    res.json(teamMembers);
});

module.exports = router;
