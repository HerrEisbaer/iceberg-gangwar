on("gameEventTriggered", (name, args) => {
    console.log(`Game event ${name} ${args.join(', ')}`)
});

const fetch = require('node-fetch');

onNet('showgamertags', async data => {
    const player = source;
    const username = (await fetch(`http://localhost:42069/database/getName/${GetPlayerIdentifier(player, 1).split(":")[1]}`).then(res => res.json())).name;
    const friends = await fetch(`http://localhost:42069/database/getAllFriends/${username}`).then(res => res.json())
    // const friends = [{fivem: "alöksjnbdamsn"}]
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

function RegisterServerCallback(name, soFunction) {
    const eventData = onNet(`boergie__cb${GetCurrentResourceName()}_${name}`, async (...args) => {
        const player = source;
        emitNet(`boergie__cb${GetCurrentResourceName()}__response_${name}_${player.toString()}`, player, await soFunction(player, args))
    })
}

// PARTYSYSTEM

const parties = {};

onNet('createParty', (partyid, owner) => {
    parties[partyid] = {
        owner: owner,
        members: [],
        blocked: [],
        options: {
            allowReqs: true,
            allowOtherInvites: false
        }
    }
})