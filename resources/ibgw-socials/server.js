on("gameEventTriggered", (name, args) => {
    console.log(`Game event ${name} ${args.join(', ')}`)
});

const fetch = require('node-fetch');

onNet('showgamertags', async data => {
    const player = source;
    const username = (await fetch(`http://localhost:42069/database/getName/${GetPlayerIdentifier(player, 1).split(":")[1]}`).then(res => res.json())).name;
    const friends = await fetch(`http://localhost:42069/database/getAllFriends/${username}`).then(res => res.json())
    const allOnline = await fetch('http://localhost:30120/players.json').then(res => res.json());
    friends.forEach(friend => {
        var result = allOnline.filter(obj => {
            return obj.identifiers[1].split(":")[1] === friend.fivem
        }) || null;
        if (result[0] == null) return;
        emitNet('showplayertags', result[0].id, result[0])
    })
})

onNet('hidegamertags', async data => {
    const player = source;
    const username = (await fetch(`http://localhost:42069/database/getName/${GetPlayerIdentifier(player, 1).split(":")[1]}`).then(res => res.json())).name;
    const friends = await fetch(`http://localhost:42069/database/getAllFriends/${username}`).then(res => res.json())
    const allOnline = await fetch('http://localhost:30120/players.json').then(res => res.json());
    friends.forEach(friend => {
        var result = allOnline.filter(obj => {
            return obj.identifiers[1].split(":")[1] === friend.fivem
        }) || null;
        if (result[0] == null) return;
        emitNet('hideplayertags', result[0].id, result[0])
    })
})

onNet('showPartyTags', async data => {
    const player = source;
    const username = (await fetch(`http://localhost:42069/database/getName/${GetPlayerIdentifier(player, 1).split(":")[1]}`).then(res => res.json())).name;
    console.log(data);
    const allOnline = await fetch('http://localhost:30120/players.json').then(res => res.json());
})

RegisterServerCallback("cbAllValidFriends", async (source) => {
    const player = source;
    const username = (await fetch(`http://localhost:42069/database/getName/${GetPlayerIdentifier(player, 1).split(":")[1]}`).then(res => res.json())).name;
    const friends = await fetch(`http://localhost:42069/database/getAllFriends/${username}`).then(res => res.json())
    const allOnline = await fetch('http://localhost:30120/players.json').then(res => res.json());
    return { friends: friends, allOnline: allOnline }
})

const namesandfraks = {};

onNet('sobisschenfrakdingens', frakname => {
    const player = source;
    namesandfraks[GetPlayerIdentifier(player, 1).split(":")[1]] = { frak: frakname };;
})

RegisterServerCallback('getFrakOfIdentifier', (source, args) => {
    const identifier = args[0][0];
    return namesandfraks[identifier].name === namesandfraks[GetPlayerIdentifier(source, 1).split(":")[1]].name
})

RegisterServerCallback('boergieFicktMütter', async (source) => {
    const player = source;
    const perms = await fetch('http://localhost:42069/database/getPermLevel', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            fivem: GetPlayerIdentifier(player, 1).split(":")[1]
        })
    }).then(res => res.json());
    return perms;
})

function RegisterServerCallback(name, soFunction) {
    const eventData = onNet(`boergie__cb${GetCurrentResourceName()}_${name}`, async (...args) => {
        const player = source;
        emitNet(`boergie__cb${GetCurrentResourceName()}__response_${name}_${player.toString()}`, player, await soFunction(player, args))
    })
}

// PARTYSYSTEM

onNet('createParty', (obj) => {
    fetch('http://localhost:42069/discordapi/createParty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(obj)
    });
})

RegisterServerCallback("cbAllPartyMembers", async (source) => {
    const player = source;
    const username = (await fetch(`http://localhost:42069/database/getName/${GetPlayerIdentifier(player, 1).split(":")[1]}`).then(res => res.json())).name;
    const partyid = await fetch(`http://localhost:42069/discordapi/getParty/${username}`).then(res => res.json());
    const partyobj = await fetch(`http://localhost:42069/discordapi/getPartyObject/${partyid}`).then(res => res.json());
    const arrayOfIds = []
    for (member of partyobj.members) {
        const ids = await fetch(`http://localhost:42069/database/getDiscordFromName/${member}`).then(res => res.json());
        arrayOfIds.push(ids)
    }
    const allOnline = await fetch('http://localhost:30120/players.json').then(res => res.json());
    return { members: arrayOfIds, allOnline: allOnline }
})

onNet('hidepartytags', async data => {
    const player = source;
    const allOnline = await fetch('http://localhost:30120/players.json').then(res => res.json());
    const arrayOfIds = []
    for (member of data.members) {
        const ids = await fetch(`http://localhost:42069/database/getDiscordFromName/${member}`).then(res => res.json());
        arrayOfIds.push(ids)
    }
    arrayOfIds.forEach(member => {
        var result = allOnline.filter(obj => {
            return obj.identifiers[1].split(":")[1] === member.fivem
        }) || null;
        if (result[0] == null) return;
        emitNet('hideplayertags', result[0].id, result[0])
    })
})

RegisterServerCallback('getFrakNameOfIdentifier', (source, args) => {
    const identifier = args[0][0];
    return {other: namesandfraks[identifier].frak, own: namesandfraks[GetPlayerIdentifier(source, 1).split(":")[1]].frak}
})

const fraks = require('../freeroam/fraks.json');

RegisterServerCallback('getAllFraks', (source, args) => {
    return fraks;
})

const Delay = (ms) => new Promise((res) => setTimeout(res, ms));

onNet('checkIfOtherSollenGezogenWerden', async () => {
    const player = source;
    const username = (await fetch(`http://localhost:42069/database/getName/${GetPlayerIdentifier(player, 1).split(":")[1]}`).then(res => res.json())).name;
    const partyid = await fetch(`http://localhost:42069/discordapi/getParty/${username}`).then(res => res.json());
    if (!partyid) return;
    const partyobj = await fetch(`http://localhost:42069/discordapi/getPartyObject/${partyid}`).then(res => res.json());
    const partyownerids = await fetch(`http://localhost:42069/database/getDiscordFromName/${partyobj.members[0]}`).then(res => res.json());
    if (partyownerids.fivem !== GetPlayerIdentifier(player, 1).split(":")[1]) return;
    const allOnline = await fetch('http://localhost:30120/players.json').then(res => res.json());
    for (member of partyobj.members) {
        const ids = await fetch(`http://localhost:42069/database/getDiscordFromName/${member}`).then(res => res.json());
        if (namesandfraks[partyownerids.fivem].frak !== namesandfraks[ids.fivem].frak) {
            let result = fraks.find(frak => {
                return frak.name === namesandfraks[partyownerids.fivem].frak;
            }) || null;
            let onlineuser = allOnline.find(user => {
                return user.identifiers[1].split(":")[1] === GetPlayerIdentifier(player, 1).split(":")[1];
            }) || null;
            emitNet('addNotify', onlineuser.id, "Partysystem", "Dein Party Owner hat die Frak gewechselt, in 5 Sekunden wirst du mitgezogen.")
            await Delay(5000);
            emitNet('setFrak', onlineuser.id, {frak: result, donotcb: true});
        }
    }
})