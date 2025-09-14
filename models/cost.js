// models/cost.js
// This file defines the Mongoose schema and model for 'Cost' documents.
const mongoose = require('mongoose');

// Define the Cost schema
const costSchema = new mongoose.Schema({
    description: { type: String, required: true },
    // 'category' field: A string that is required. The value must be one of the specified options.
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sports', 'education']
    },
    // 'userid' field: A number that links the cost to a specific user. It is required.
    userid: { type: Number, required: true },
    sum: { type: Number, required: true },
    date: { type: Date, default: Date.now } // Added date field
});
// This model provides an interface for interacting with the 'costs' collection in the database.
const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
