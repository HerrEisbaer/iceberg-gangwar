const mongoose = require('mongoose');

const kriegSchema = new mongoose.Schema({
    frak1: String,
    frak2: String,
    by: String,
    stats: {
        frak1: {
            kills: Number,
            deaths: Number,
        },
        frak2: {
            kills: Number,
            deaths: Number,
        }
    }
});

module.exports = mongoose.model("Krieg", kriegSchema);