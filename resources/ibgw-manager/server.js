const mongoose = require('mongoose');
var sha256 = require("sha256");

const User = require('./schemas/User');
const Frak = require('./schemas/Frak');

const fetch = require('node-fetch');

mongoose.set("strictQuery", false);

mongoose.connect("mongodb+srv://boergie:DzH6eeAABhtV5xqM@cluster0.cb0auxa.mongodb.net/?", () => {
    console.log("Connection to Database succesfully established.");
}, e => console.error(`Couldn't connect to Database: ${e}`))


on('playerConnecting', (name, setKickReason, deferrals) => {
    const allidentifiers = {};
    deferrals.defer()
    const player = source;
    setTimeout(async () => {
        const apistatus = await fetch('http://localhost:42069/ok').then(res => res.json()).catch(e => {
            console.log("api down", e);            
        });
        if (!apistatus) {
            deferrals.done("Couldn't connect to API. This is an Issue by IBGW. Report this Issue on our Discord.")
            return;
        };
        deferrals.update(`Hello ${name}. Your steam ID is being checked.`)
        for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
            const identifier = GetPlayerIdentifier(player, i);
            allidentifiers[identifier.split(':')[0]] = identifier.split(':')[1];
        }
        setTimeout(async () => {
            if (allidentifiers.steam == null || allidentifiers.discord == null) {
                deferrals.done(`You are either not connected to Steam or to Discord: Steam: ${allidentifiers.steam}, Discord: ${allidentifiers.discord}`)
            } else {
                deferrals.update(`Discord (${allidentifiers.discord}) is being checked.`)
                const istaufdc = await fetch(`http://localhost:42069/discordapi/getuser/${GetPlayerIdentifier(player, 2).split(":")[1]}`).then(res => res.json());
                if (istaufdc.status === 400) {
                    deferrals.done("Your connected Discord Account hasn't joined our Discord Server.")
                    return;
                }
                setTimeout(async () => {
                    const perms = await fetch('http://localhost:42069/database/getPermLevel', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                        },
                        body: JSON.stringify({
                            fivem: GetPlayerIdentifier(player, 1).split(":")[1]
                        })
                    }).then(res => res.json());
                    if (!(perms.rechte >= 5)) {
                        deferrals.done("You're not whitelisted.")
                        console.log("vollrp");
                        return;
                    } else {
                        console.log("keinrp");
                        deferrals.done()
                    }
                }, 0);
            }
        }, 0)
    }, 0)
})

// Login

onNet('logUserIn', async data => {
    const player = source
    const user = await User.findOne({ "userinfo.name": data.username } )
    if (user == null) {
        const neueSuche = await User.findOne({ "userinfo.identifiers.fivem": GetPlayerIdentifier(player, 1).split(":")[1]})
        if (neueSuche == null) {
            //Alert mit Eingabe
            const wehSuche = await User.findOne({ "userinfo.name": { $regex : new RegExp(data.username, "i") } });
            if (wehSuche) {
                emitNet('loginCompletet', player, { loggedin: false, error: "Es existiert schon ein Account mit dem Namen." });
                return;
            }
            const steamsuche = await User.findOne({ "userinfo.identifiers.steam": GetPlayerIdentifier(player, 0).split(":")[1]});
            if (steamsuche) {
                emitNet('loginCompletet', player, { loggedin: false, error: "Es existiert schon ein Account mit dem Steam Identifier. Wende dich an den Support." });
                return;
            }
            const discordsuche = await User.findOne({ "userinfo.identifiers.discord": GetPlayerIdentifier(player, 2).split(":")[1]});
            if (discordsuche) {
                emitNet('loginCompletet', player, { loggedin: false, error: "Es existiert schon ein Account mit dem Discord Identifier. Wende dich an den Support." });
                return;
            }
            const istaufdc = await fetch(`http://localhost:42069/discordapi/getuser/${GetPlayerIdentifier(player, 2).split(":")[1]}`).then(res => res.json());
            if (istaufdc.status === 400) {
                emitNet('loginCompletet', player, { loggedin: false, error: "Du musst unserem Discord beitreten." });
                return;
            }
            const newUser = new User({
                userinfo: {
                    name: data.username,
                    discriminator: undefined,
                    createdAt: new Date(),
                    latestLogin: new Date(),
                    password: sha256(data.password),
                    identifiers: {
                        fivem: GetPlayerIdentifier(player, 1).split(":")[1],
                        steam: GetPlayerIdentifier(player, 0).split(":")[1],
                        discord: GetPlayerIdentifier(player, 2).split(":")[1]
                    }
                },
                stats: {
                    kills: 0,
                    deaths: 0,
                    kd: 0,
                    level: {
                        xp: 0,
                        level: 0
                    },
                    latestFrak: undefined
                },
                settings: {
                    weapons: {
                        advancedrifle: true,
                        bullpuprifle: true,
                        specialcarbine: true,
                        carbinerifle: true,
                        assaultrifle: true,
                        smg: true,
                        gusenberg: true,
                        pistol: true,
                        pistol50: true,
                        heavypistol: true,
                        bat: true,
                        battleaxe: true,
                        golfclub: true
                    },
                    friends: {
                        allowfr: true
                    }
                },
                friends: [],
                team: {
                    name: undefined,
                    member: []
                },
                party: {
                    name: undefined,
                    member: []
                },
                groups: ["user"]
            })
            await newUser.save()
            console.log("Neuen User angelegt.");
        } else {
            emitNet('loginCompletet', player, { loggedin: false, error: "Du hast schon einen Account." })
        }
    } else {
        if (user.userinfo.identifiers.fivem === GetPlayerIdentifier(player, 1).split(":")[1]) {
            if (user.userinfo.password === sha256(data.password)) {
                user.userinfo.latestLogin = new Date()
                user.userinfo.identifiers = {
                    fivem: GetPlayerIdentifier(player, 1).split(":")[1],
                    steam: GetPlayerIdentifier(player, 0).split(":")[1],
                    discord: GetPlayerIdentifier(player, 2).split(":")[1]
                }
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

async function getPlayer() {
    const player = source;
    return await User.findOne({ "userinfo.identifiers.fivem": GetPlayerIdentifier(player, 1).split(":")[1]})
}

// onNet('sendUserstats', async () => {
//     const player = source;
//     const userstats = await getPlayer();
//     emitNet('cbUserstats', player, userstats._doc.stats)
//     return;
// })

RegisterServerCallback("sendUserstats", async (source) => {
    const player = source;
    const userstats = await getPlayer();
    return userstats._doc.stats;
})

RegisterNetServerCallback("sendUserstats", async (source) => {
    const player = source;
    const userstats = await getPlayer();
    return userstats._doc.stats;
})

function RegisterNetServerCallback(name, soFunction) {
    const eventData = onNet(`boergie__cb_${name}`, async (...args) => {
        const player = source;
        emitNet(`boergie__cbnet__response_${name}_${player.toString()}`, player, await soFunction(player))
    })
}

// Frakcreator

onNet('saveFrak', frak => {
    console.log(frak);
    const newFrak = new Frak(frak);
    newFrak.save()
    return;
})

// Playerdeaths

onNet('addPlayerDeath', async () => {
    const player = source;
    const user = await getPlayer();
    user.stats.deaths++;
    await user.save()
    return;
})

// Settings

onNet('setSettings', async data => {
    const player = source;
    const user = await getPlayer();
    user.settings = data.settings;
    await user.save();
    return;
})

onNet('sendUserSettings', async () => {
    const player = source;
    const { settings } = await getPlayer();
    emitNet('cbUserSettings', player, settings);
    return;
})

//so globale variablen was so jeder braucht und so

const Playercount = require('./schemas/Playercount');
const DurchschnittSchema = require('./schemas/Durschnitt');

setInterval(async () => {
    const date = new Date();
    if (date.getMinutes() === 0 && date.getSeconds() === 0) {
        const playercount = await Playercount.findOne({
            uhrzeit: date.getHours(),
        })
        playercount.playercount = (await fetch('http://localhost:30120/players.json').then(res => res.json())).length;
        await playercount.save();
        console.log("New Playercount saved", playercount);

        var totalkills = 0;
        var totaldeaths = 0;
        var totallevel = 0;
        const allplayerslol = await User.find();
        for (let i = 0; i < allplayerslol.length; i++) {
            const player = allplayerslol[i];
            if (player.stats == null) return;
            totalkills += player.stats.kills;
            totaldeaths += player.stats.deaths;
            totallevel += player.stats.level.level;
        }
        const killsdurschnitt = await DurchschnittSchema.findOne({"type": 0})
        killsdurschnitt.value = totalkills / allplayerslol.length;
        killsdurschnitt.save();
        const deathsdurschnitt = await DurchschnittSchema.findOne({"type": 1})
        deathsdurschnitt.value = totaldeaths / allplayerslol.length;
        deathsdurschnitt.save();
        const leveldurschnitt = await DurchschnittSchema.findOne({"type": 2})
        leveldurschnitt.value = totallevel / allplayerslol.length;
        leveldurschnitt.save();
        console.log(`Neue Durchschnitte gespeichert: ${totalkills / allplayerslol.length}(${totalkills}), ${totaldeaths / allplayerslol.length}(${totaldeaths}), 
        ${totallevel / allplayerslol.length}(${totallevel})`);
    }
}, 1000);

const Krieg = require('./schemas/Krieg');

on('saveKrieg', async (frak1, frak2, identifier) => {
    await (new Krieg({
        frak1: frak1,
        frak2: frak2,
        by: identifier,
        stats: {
            frak1: {
                kills: 0,
                deaths: 0,
            },
            frak2: {
                kills: 0,
                deaths: 0,
            }
        }
    })).save()
})

RegisterServerCallback('getUserSettings', async (source) => {
    const player = source;
    const { settings } = await getPlayer();
    return settings;
})

RegisterServerCallback('getDiscordId', (source) => {
    const player = source;
    return GetPlayerIdentifier(player, 2).split(":")[1];
})

RegisterServerCallback('getUsername', async (source) => {
    const player = source;
    const user = await getPlayer();
    return user.userinfo.name;
})

function RegisterServerCallback(name, soFunction) {
    const eventData = onNet(`boergie__cb${GetCurrentResourceName()}_${name}`, async (...args) => {
        const player = source;
        emitNet(`boergie__cb${GetCurrentResourceName()}__response_${name}_${player.toString()}`, player, await soFunction(player))
    })
}

onNet('sowehrestart', () => {
    emit("restart:checkreboot")
})