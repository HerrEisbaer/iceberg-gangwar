const mongoose = require('mongoose');

const durchschnittSchema = new mongoose.Schema({
    type: Number,
    value: Number
});

module.exports = mongoose.model("Durchschnitt", durchschnittSchema);