var sha256 = require("sha256");

const mongoose = require('mongoose')

mongoose.set("strictQuery", false);

// Mongoose Schemas
const User = require('./User')

// mongoose.connect("mongodb+srv://boergie:DzH6eeAABhtV5xqM@cluster0.cb0auxa.mongodb.net/?", () => {
//     console.log("connectet");
// }, e => console.error(e))

// onNet('logUserIn', async data => {
//     const player = source
//     const user = await User.findOne({ "userinfo.name": data.username } )
//     if (user == null) {
//         const neueSuche = await User.findOne({ "userinfo.identifier": GetPlayerIdentifier(player)})
//         if (neueSuche == null) {
//             //Alert mit Eingabe
//             const newUser = new User({
//                 userinfo: {
//                     name: data.username,
//                     discriminator: undefined,
//                     createdAt: new Date(),
//                     latestLogin: new Date(),
//                     password: sha256(data.password),
//                     identifier: GetPlayerIdentifier(player)
//                 },
//                 stats: {
//                     kills: 0,
//                     deaths: 0,
//                     kd: 0,
//                     level: {
//                         xp: 0,
//                         level: 0
//                     },
//                     latestFrak: undefined
//                 },
//                 friends: [],
//                 team: {
//                     name: undefined,
//                     member: []
//                 },
//                 party: {
//                     name: undefined,
//                     member: []
//                 },
//                 groups: ["user"]
//             })
//             await newUser.save()
//             console.log("Neuen User angelegt.");
//         } else {
//             emitNet('loginCompletet', player, { loggedin: false, error: "Du hast schon einen Account." })
//         }
//     } else {
//         if (user.userinfo.identifier === GetPlayerIdentifier(player)) {
//             if (user.userinfo.password === sha256(data.password)) {
//                 user.userinfo.latestLogin = new Date()
//                 await user.save()
//                 emitNet('loginCompletet', player, { loggedin: true, error: null })
//             } else {
//                 emitNet('loginCompletet', player, { loggedin: false, error: "Falsches Passwort." })
//             }
//         } else {
//             emitNet('loginCompletet', player, { loggedin: false, error: "Dieser Account scheint nicht dir zu gehören..." })
//         }
//     }
// });

// onNet('sendUserstats', async () => {
//     const player = source;
//     const userstats = await User.findOne({ "userinfo.identifier": GetPlayerIdentifier(player)})
//     emitNet('cbUserstats', player, userstats._doc.stats)
// })