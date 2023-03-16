const mongoose = require('mongoose')

const playercountScheme = new mongoose.Schema({
    player: Number,
    uhrzeit: Date
})

module.exports = mongoose.model("PlayerCount", playercountScheme)