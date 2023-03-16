const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userinfo: {
        name: String,
        discriminator: Number,
        createdAt: Date,
        latestLogin: Date,
        password: String,
        identifiers: {
            fivem: String,
            steam: String,
            discord: String
        }
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
    settings: {
        weapons: {
            advancedrifle: Boolean,
            bullpuprifle: Boolean,
            specialcarbine: Boolean,
            carbinerifle: Boolean,
            assaultrifle: Boolean,
            smg: Boolean,
            gusenberg: Boolean,
            pistol: Boolean,
            pistol50: Boolean,
            heavypistol: Boolean,
            bat: Boolean,
            battleaxe: Boolean,
            golfclub: Boolean
        },
        friends: {
            allowfr: Boolean,
        }
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