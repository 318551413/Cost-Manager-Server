// routes/about.js

const express = require('express');
const router = express.Router();
const pino = require('pino');

const logger = pino();

router.get('/', function(req, res) {
    logger.info({ route: '/api/about', method: 'GET' }, 'Attempting to retrieve developers team details');
    const teamMembers = [
        { first_name: 'Inbal', last_name: 'Keinan' },
        { first_name: 'Nadav', last_name: 'Keinan' }
    ];
    res.json(teamMembers);
});

module.exports = router;