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
        emitNet(`boergie__cb__response_${name}_${player.toString()}`, player, await soFunction(player))
    })
}

onNet('spawnCarServerSide', data => {
    const player = source;
    const hash = GetHashKey(data.name)
    // if (!IsModelInCdimage(hash)) return
    // RequestModel(hash)
    // while (!HasModelLoaded(hash)) {
    //     await Delay(100);
    // }
    // if (currentCar != null) {
    //     DeleteEntity(currentCar)
    // }
    const currentCar = CreateVehicle(hash, data.coords[0], data.coords[1], data.coords[2], data.heading);
    TaskWarpPedIntoVehicle(GetPlayerPed(player), currentCar, -1)
    // SetVehicleColours(currentCar, currentFrak.car.primaryColor, currentFrak.car.secondaryColor)
    // SetVehicleCustomPrimaryColour(currentCar, currentFrak.car.primaryColor[0], currentFrak.car.primaryColor[1], currentFrak.car.primaryColor[2])
    // SetVehicleCustomSecondaryColour(currentCar, currentFrak.car.secondaryColor[0], currentFrak.car.secondaryColor[1], currentFrak.car.secondaryColor[2]);
    // SetVehicleMod(currentCar, 13, 2);
    // SetVehicleMod(currentCar, 15, 3);
    // SetVehicleMod(currentCar, 11, 2);
    // SetVehicleMod(currentCar, 12, 2);
    // console.log(GetPlayerPed(player), currentCar);
    // SetPedIntoVehicle(GetPlayerPed(player), currentCar, -1)
    // TaskWarpPedIntoVehicle(GetPlayerPed(GetPlayerFromServerId(player)), currentCar, -1);
    // SetPedIntoVehicle(
    //     // ped: Ped,
    //     // vehicle: Vehicle, 
    //     // seatIndex: number
    // );
})

const fetch = require('node-fetch');

RegisterServerCallback('getUsername', async (source, args) => {
    const player = source;
    const username = (await fetch(`http://localhost:42069/database/getName/${GetPlayerIdentifier(player, 1).split(":")[1]}`).then(res => res.json())).name;
    console.log(username);
    return username;
})

RegisterServerCallback("getIfAllowedForNoclip", async () => {
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
    return perms.rechte >= 2;
})

emitNet('askedForNoClip', () => {
    const player = source;

})
// Party

// function RegisterNetServerCallback(name, soFunction) {
//     const eventData = onNet(`boergie__cb_${name}`, async (...args) => {
//         const player = source;
//         emitNet(`boergie__cbnet__response_${name}_${player.toString()}`, player, await soFunction(player))
//     })
// }

// RegisterNetServerCallback('getAllFraks', async (source) => {
//     const allFraks = await fetch('./')
// })