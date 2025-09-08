//app.js This file sets up and configures the main Express server application.
const express = require('express');
// Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.
const mongoose = require('mongoose');
// Pino is a highly performant logger for Node.js.
const pino = require('pino');
// dotenv loads environment variables from a .env file into process.env.
require('dotenv').config();
// --- Initialization ---
const app = express();
const logger = pino();

const Log = require('./models/log');

// --- Middleware ---
// This middleware logs all incoming requests to the database before processing them.
app.use(async (req, res, next) => {
    try {
        const log = new Log({
            level: 30,
            time: new Date(),
            msg: `Incoming request: ${req.method} ${req.url}`
        });
        await log.save();
    } catch (err) {
        // Log an error if saving the log to the database fails.
        logger.error('Failed to save log to database', err);
    }
    // Pass control to the next middleware or route handler.
    next();
});
// Built-in Express middleware to parse incoming JSON requests.
app.use(express.json());
// Built-in Express middleware to parse URL-encoded data.
app.use(express.urlencoded({ extended: true }));

// --- Route Imports ---
// Import all route handlers from the 'routes' directory.
const costsRouter = require('./routes/costs');
const usersRouter = require('./routes/users');
const aboutRouter = require('./routes/about');
const logsRouter = require('./routes/logs');
const addRouter = require('./routes/add');
// --- Route Connections ---
// Connect each router to its specific base path in the application.
app.use('/api/add', addRouter);
app.use('/api/users', usersRouter);
app.use('/api/report', costsRouter);
app.use('/api/about', aboutRouter);
app.use('/api/logs', logsRouter);

// --- Server Startup ---
// Export the app object for testing purposes, allowing test frameworks to use it.
module.exports = app;
// This condition ensures the server only starts when the file is executed directly,
// not when it's imported as a module in a test file.
if (require.main === module) {
    const port = process.env.PORT || 3000;
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            logger.info('Connected to MongoDB Atlas');
            app.listen(port, () => {
                logger.info(`Server listening on port ${port}`);
            });
        })
        .catch(err => {
            logger.error({ error: err.message }, 'Failed to connect to MongoDB Atlas');
            process.exit(1);
        });
}