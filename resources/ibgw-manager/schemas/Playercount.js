const mongoose = require('mongoose');

const dateScheme = new mongoose.Schema({
    uhrzeit: Number,
    playercount: Number
});

module.exports = mongoose.model("Playercount", dateScheme);