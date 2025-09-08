// models/cost.js (updated)

const mongoose = require('mongoose');
// Define the Cost schema
const costSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sports', 'education']
    },
    userid: { type: Number, required: true },
    sum: { type: Number, required: true },
    date: { type: Date, default: Date.now } // Added date field
});

const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
