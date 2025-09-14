// models/report.js
const mongoose = require('mongoose');
// Define the Report schema for the Computed Design Pattern
const reportSchema = new mongoose.Schema({
    _id: String,
    report: {
        userid: { type: Number, required: true },
        year: { type: Number, required: true },
        month: { type: Number, required: true },
        costs: { type: mongoose.Schema.Types.Mixed, required: true }
    }
});

module.exports = mongoose.model('Report', reportSchema);
