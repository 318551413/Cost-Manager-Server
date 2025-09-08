// Route file: routes/logs.js
// Purpose: Handles GET requests for the /api/logs path to retrieve all logs.

const express = require('express');
const router = express.Router();
const Log = require('../models/log');
const pino = require('pino');
// Create a logger object for event logging
const logger = pino();
// Define an endpoint to handle GET requests for the base path of this router
router.get('/', function(req, res) {
    logger.info({ route: '/api/logs', method: 'GET' }, 'Attempting to retrieve all logs');
    // Find all documents from the Log collection in the database
    Log.find({})
        .then(function(logs) {
            logger.info('Successfully retrieved all logs');
            res.json(logs);
        })
        .catch(function(err) {
            logger.error({ error: err.message }, 'Failed to retrieve logs');
            res.status(500).json({ error: 'Failed to retrieve logs', details: err.message });
        });
});
// Export the router for use in app.js
module.exports = router;
