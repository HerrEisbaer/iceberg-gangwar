const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userinfo: {
        name: String,
        discriminator: Number,
        createdAt: Date,
        latestLogin: Date,
        password: String,
        identifier: String
    },
    stats: {
        kills: Number,
        deaths: Number,
        kd: Number,
        level: {
            xp: Number,
            level: Number
        },
        latestFrak: String
    },
    friends: Array,
    team: {
        name: String,
        member: Array
    },
    party: {
        name: String,
        member: Array
    },
    groups: Array
})

module.exports = mongoose.model("User", userSchema)