const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rockets: {
        type: String,
        required: true
    },
    target:{
        type: String,
    },
    customers: [
        String
    ],
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    },
}); //store the schema defining the shape of launches

/*
    To create model:
    mongoose.model('name of collection', name of schema)
*/
module.exports = mongoose.model('Launch', launchesSchema); //connects launchesSchema with "launches" collection