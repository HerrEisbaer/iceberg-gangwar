var sha256 = require("js-sha256");

const mongoose = require('mongoose')

// Mongoose Schemas
const User = require('./schemas/User')

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://boergie:DzH6eeAABhtV5xqM@cluster0.cb0auxa.mongodb.net/?", () => {
    console.log("connectet");
}, e => console.error(e))

onNet('logUserIn', async data => {
    const player = source
    const user = await User.findOne({ "userinfo.name": data.username } )
    console.log(user);
    if (user == null) {
        const neueSuche = await User.findOne({ "userinfo.identifier": GetPlayerIdentifier(player)})
        if (neueSuche == null) {
            // //Alert mit Eingabe
            // const newUser = new User({
            //     userinfo: {
            //         name: data.username,
            //         discriminator: undefined,
            //         createdAt: new Date(),
            //         latestLogin: new Date(),
            //         password: sha256(data.password),
            //         identifier: GetPlayerIdentifier(player)
            //     },
            //     stats: {
            //         kills: 0,
            //         deaths: 0,
            //         kd: 0,
            //         level: {
            //             xp: 0,
            //             level: 0
            //         },
            //         latestFrak: undefined
            //     },
            //     friends: [],
            //     team: {
            //         name: undefined,
            //         member: []
            //     },
            //     party: {
            //         name: undefined,
            //         member: []
            //     },
            //     groups: ["user"]
            // })
            // await newUser.save()
            console.log("Neuen User angelegt.");
        } else {
            emitNet('loginCompletet', player, { loggedin: false, error: "Du hast schon einen Account." })
        }
    } else {
        if (user.userinfo.identifier === GetPlayerIdentifier(player)) {
            if (user.userinfo.password === sha256(data.password)) {
                user.userinfo.latestLogin = new Date()
                await user.save()
                emitNet('loginCompletet', player, { loggedin: true, error: null })
            } else {
                emitNet('loginCompletet', player, { loggedin: false, error: "Falsches Passwort." })
            }
        } else {
            emitNet('loginCompletet', player, { loggedin: false, error: "Dieser Account scheint nicht dir zu gehören..." })
        }
    }
});
const Frak = require('./schemas/frak')

//Mainmenu

onNet('getAllFraks', async () => {
    const player = source
    const allFraks = await Frak.find({})
    emitNet('gettetAllFraks', player, allFraks)
})

onNet('getFrak', async frakname => {
    const player = source
    emitNet('setFrak', player, await Frak.find({ name: frakname.toLowerCase() }))
})

onNet('getOutfits', async () => {
    const player = source
    const allFraks = await Frak.find()
    const outfits = {}
    allFraks.forEach(frak => {
        outfits[frak.name] = frak.outfits
    })
    emitNet('postOutfits', player, outfits)
})

//Frakcreator

onNet('createFrak', async data => {
    const newFrak = new Frak({
        name: data.name,
        maxmember: data.maxmember,
        outfits: data.outfits,
        cars: data.cars,
        coords: data.coords
    })
    newFrak.save()
})

//HUD

onNet('getStatsOfPlayer', async () => {
    const player = source
    const playerInfo = await User.findOne({ "userinfo.identifier": GetPlayerIdentifier(player)})

    emitNet('postPlayerData', player, {
        id: player,
        kills: playerInfo.stats.kills,
        deaths: playerInfo.stats.deaths,
        kd: playerInfo.stats.kills/playerInfo.stats.deaths,
        level: playerInfo.stats.level
    })
})

//OnDeath

on('baseevents:onPlayerDied', (type, coords) => {
    console.log(`woah u just died at ${coords} by ${type}`);
})