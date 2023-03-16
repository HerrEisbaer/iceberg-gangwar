const mongoose = require('mongoose');

const kriegSchema = new mongoose.Schema({
    frak1: String,
    frak2: String,
    by: String
});

module.exports = mongoose.model("Krieg", kriegSchema);