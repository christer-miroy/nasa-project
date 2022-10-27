const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    /* Naming convention must be the same with front end */
    keplerName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Planet', planetSchema);