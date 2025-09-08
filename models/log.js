const mongoose = require('mongoose');

// Define the Log schema for Pino messages
const logSchema = new mongoose.Schema({
    level: { type: Number, required: true },
    time: { type: Date, default: Date.now },
    msg: { type: String, required: true },
    pid: { type: Number },
    hostname: { type: String },
    url: { type: String },
    method: { type: String },
    ip: { type: String },
    v: { type: Number }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
