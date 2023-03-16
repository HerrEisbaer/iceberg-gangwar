const krieg = {
    frak1: null,
    frak2: null,
    by: null
}

onNet('logToServer', (msg) => {
    console.log(msg);
})

// onNet('addPlayerDeath', async () => {
//     const player = source;
//     const user = await User.findOne({ "userinfo.identifier": GetPlayerIdentifier(player)});
//     user.stats.deaths++;
//     await user.save()
// })

const fraks = require('./fraks.json');

onNet('setKrieg', async (frak1, frak2) => {
    const player = source;
    var frak1found = false;
    var frak2found = false;
    fraks.forEach(frak => {
        const frakname = frak.name.toLowerCase()
        if (frakname === frak1) frak1found = true;
        if (frakname === frak2) frak2found = true;
    })
    if (frak1found && frak2found) {
        emit('saveKrieg', frak1, frak2, GetPlayerIdentifier(player))
        emitNet('addAlert', -1, "Krieg", `${frak1} und ${frak2} haben nun Krieg`);
    } else {
        emitNet('addNotify', player, "System", "Du musst schon 2 richtige Fraks eingeben");
    }
})

RegisterServerCallback('getIfPlayerIsAdmin', function (source) {
    const player = source;
    return IsPlayerAceAllowed(player, "war");
})

function RegisterServerCallback(name, soFunction) {
    const eventData = onNet(`boergie__cb_${name}`, async (...args) => {
        const player = source;
        emitNet(`boergie__cb__response_${name}_${player.toString()}`, player, soFunction(player))
    })
}