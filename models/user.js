// This file defines the Mongoose schema and model for a 'User'.
const mongoose = require('mongoose');
// Define the users schema
const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Export the model for use in other files
module.exports = User;
