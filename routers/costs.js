// routes/costs.js - Handles GET requests for monthly cost reports.
const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
const Report = require('../models/report');
const User = require('../models/user');
const pino = require('pino');

const logger = pino();

router.get('/', async (req, res) => {
    try {
        // Validate presence of required query parameters
        const { userid, year, month } = req.query;
        if (!userid || !year || !month) {
            logger.warn('Missing parameters for report');
            return res.status(400).json({ error: 'Missing userid, year, or month parameters' });
        }

        const userExists = await User.exists({ id: userid });
        if (!userExists) {
            logger.warn({ userid }, 'User not found, cannot generate report');
            return res.status(404).json({ error: 'User not found' });
        }
        // Use a composite ID for the report based on the Computed Design Pattern
        const reportId = `${userid}_${year}_${month}`;
        const existingReport = await Report.findById(reportId);
        // Determine if the requested month is in the past
        const requestedDate = new Date(year, month - 1, 1);
        const now = new Date();
        const isPastMonth = requestedDate < new Date(now.getFullYear(), now.getMonth(), 1);
        // Check if a pre-computed report exists for a past month

        if (isPastMonth && existingReport) {
            logger.info({ reportId }, 'Returning pre-computed report from database');
            return res.status(200).json(existingReport.report);
        }
        // If a report exists for the current or future month, it might be outdated. Delete it.
        if (existingReport && !isPastMonth) {
            await Report.deleteOne({ _id: reportId });
        }
        // Compute and save a new report
        const newReport = await computeAndSaveReport(userid, year, month);
        logger.info({ newReport }, 'Report not found, computing and saving new report');
        res.status(200).json(newReport.report);

    } catch (err) {
        logger.error({ error: err.message }, 'Failed to process report request');
        return res.status(500).json({ error: 'Failed to generate report', details: err.message });
    }
});
// Helper function to compute and save the report
async function computeAndSaveReport(userid, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    // Find all costs for the specified user and date range
    const costs = await Cost.find({
        userid: userid,
        date: { $gte: startDate, $lte: endDate }
    });
    // Initialize the report structure
    const reportData = {
        userid: parseInt(userid),
        year: parseInt(year),
        month: parseInt(month),
        costs: []
    };
    // Create a map to group costs by category
    const categoriesMap = {
        "food": [],
        "health": [],
        "housing": [],
        "sports": [],
        "education": []
    };
    // Populate the map with costs from the database
    costs.forEach(cost => {
        if (categoriesMap[cost.category]) {
            categoriesMap[cost.category].push({
                sum: cost.sum,
                description: cost.description,
                day: cost.date.getDate()
            });
        }
    });
    // Convert the grouped costs into the final report format (an array of category objects)
    for (const category in categoriesMap) {
        reportData.costs.push({ [category]: categoriesMap[category] });
    }
    // Create and save the new report document
    const newReport = new Report({
        _id: `${userid}_${year}_${month}`,
        report: reportData
    });

    await newReport.save();
    return { report: reportData };
}

module.exports = router;
