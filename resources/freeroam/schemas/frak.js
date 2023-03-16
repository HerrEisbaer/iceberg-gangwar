const mongoose = require('mongoose')

const frakScheme = mongoose.Schema({
    name: String,
    maxmember: Number,
    outfits: {
        otherparts: {
            head: {
                hat: Array,
                mask: Array
            },
            body: {
                shirt: Array,
                pullover: Array
            },
            legs: {
                pants: Array
            },
            feet: {
                shoes: Array
            }
        }
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