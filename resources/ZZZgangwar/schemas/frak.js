const mongoose = require('mongoose')

const frakScheme = mongoose.Schema({
    name: String,
    maxmember: Number,
    currentMember: Number,
    outfits: Array,
    cars: {
        default: Boolean,
        addCars: Array
    },
    car: {
        primaryColor: String,
        secondaryColor: String
    },
    coords: {
        playerspawn: Array,
        carspawns: Array
    }
})

module.exports = mongoose.model("Frak", frakScheme)