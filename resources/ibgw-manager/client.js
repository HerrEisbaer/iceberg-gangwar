const spawn = [686.245, 577.950, 130.461];

var currentFrak = {
    coords: {
        playerspawn: [{heading: 0, coords: [686.245, 577.950, 130.461]}]
    }
}

on('onClientGameTypeStart', () => {
  exports.spawnmanager.setAutoSpawnCallback(() => {
    exports.spawnmanager.spawnPlayer({
      x: currentFrak.coords.playerspawn[0].coords[0],
      y: currentFrak.coords.playerspawn[0].coords[1],
      z: currentFrak.coords.playerspawn[0].coords[2],
      model: 'mp_m_freemode_01',
      skipFade: true
    }, () => {
      if (currentFrak.outfits == null) {
          SetPedDefaultComponentVariation(PlayerPedId());
          FreezeEntityPosition(PlayerPedId(), true);
          SetEntityHeading(PlayerPedId(), 165);
          emit('openLogin')
          ShutdownLoadingScreenNui();
          return
      }
      setClothing({
          clothing: currentFrak.outfits,
          shirt: currentFrak.outfits.body.shirt[0][0]
      })
      GiveWeaponsToPlayer();
      SetPedArmour(PlayerPedId(), 100);
      emit('showHUD');
      emit('fireshowplayertags');
    })
  });
  exports.spawnmanager.setAutoSpawn(true)
  exports.spawnmanager.forceRespawn()
});

function setClothing(data) {
  const clothing = data.clothing;
  SetPedComponentVariation(PlayerPedId(), 3, clothing.body.torso[0][2], 0, GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.body.torso[0][2]))
  SetPedComponentVariation(PlayerPedId(), 8, data.shirt, 0, GetNumberOfPedDrawableVariations(PlayerPedId(), data.shirt))
  SetPedComponentVariation(PlayerPedId(), 11, clothing.body.torso[0][0], clothing.body.torso[0][1], GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.body.torso[0][0]))
  SetPedComponentVariation(PlayerPedId(), 4, clothing.legs.pants[0][0], clothing.legs.pants[0][1], GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.legs.pants[0][0]))
  SetPedComponentVariation(PlayerPedId(), 6, clothing.feet.shoes[0][0], clothing.feet.shoes[0][1], GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.feet.shoes[0][0]))
  SetPedComponentVariation(PlayerPedId(), 1, clothing.head.mask[0][0], clothing.head.mask[0][1], GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.head.mask[0][0]))
}

on('giveweapons', () => {
  TriggerServerCallback('getUserSettings', (settings) => {
    RemoveAllPedWeapons(PlayerPedId());
    for (let i = 0; i < Object.keys(settings.weapons).length; i++) {
      const weaponnames = Object.keys(settings.weapons);
      const weaponstates = Object.values(settings.weapons);

      if (weaponstates[i]) {
        GiveWeaponToPed(PlayerPedId(), `weapon_${weaponnames[i]}`, 999, false, false);
        SetPedInfiniteAmmo(PlayerPedId(), true, `weapon_${weaponnames[i]}`);
      }
    }
    return;
  })
  return;
})

function GiveWeaponsToPlayer() {
  emitNet('sendUserSettings');
  TriggerServerCallback('getUserSettings', settings => {
    RemoveAllPedWeapons(PlayerPedId());
    for (let i = 0; i < Object.keys(settings.weapons).length; i++) {
      const weaponnames = Object.keys(settings.weapons);
      const weaponstates = Object.values(settings.weapons);

      if (weaponstates[i]) {
        GiveWeaponToPed(PlayerPedId(), `weapon_${weaponnames[i]}`, 999, false, false);
        SetPedInfiniteAmmo(PlayerPedId(), true, `weapon_${weaponnames[i]}`);
      };
    };
    return;
  });
}

RegisterNuiCallbackType('setFrak');

on('__cfx_nui:setFrak', (data, cb) => {
  currentFrak = data.frak;
  cb(true)
})

RegisterNuiCallbackType('getPlayerID')

on('__cfx_nui:getPlayerID', (data, cb) => {
  cb(GetPlayerServerId(PlayerId()));
})

RegisterNuiCallbackType('getUserStats')

on('__cfx_nui:getUserStats', (data, cb) => {
  TriggerServerCallback('sendUserstats', (stats) => {
    cb(stats)
  })
  // emitNet('sendUserstats')
  // onNet('cbUserstats', cb)
  return
})

RegisterNuiCallbackType('setsetting')

on('__cfx_nui:setsetting', (data, cb) => {
  emitNet('setSettings', data)
  cb(true)
})

RegisterNuiCallbackType('getUserSettings')

on('__cfx_nui:getUserSettings', (data, cb) => {
  emitNet('sendUserSettings');
  onNet('cbUserSettings', cb)
})

RegisterNuiCallbackType('getDiscordId')

on('__cfx_nui:getDiscordId', (data, cb) => {
  TriggerServerCallback("getDiscordId", (discordid) => {
    cb(discordid || false)
  })
})

RegisterNuiCallbackType('getOwnName')

on('__cfx_nui:getOwnName', (data, cb) => {
  TriggerServerCallback("getUsername", (username) => {
    cb(username);
  })
})

RegisterNuiCallbackType('getStatusOfPlayer')

// on('__cfx_nui:getStatusOfPlayer', (data, cb) => {
//   console.log(data.identifier);
//   TriggerServerCallback("getStatusOfPlayerWeh", (status) => {
//     cb(status);
//   }, data.identifier)
//   // cb(true)
// })

SetMaxWantedLevel(0);

setInterval(() => {
  InvalidateIdleCam()
  InvalidateVehicleIdleCam()
}, 10000);

on('baseevents:onPlayerDied', async (killerType, deathCoords) => {
  emit('firehidegamertags');
  emitNet('addPlayerDeath')
  return;
})

function TriggerServerCallback(name, cbFunction, ...args) {
  const lol = GetPlayerServerId(PlayerId())
  const event = (data) => {
    cbFunction(data);
    removeEventListener(`boergie__cb${GetCurrentResourceName()}__response_${name}_${lol}`, event);
  } 
  onNet(`boergie__cb${GetCurrentResourceName()}__response_${name}_${lol}`, event)
  emitNet(`boergie__cb${GetCurrentResourceName()}_${name}`, args, "|")
}

// const setPlayerModelSafe = async (modelHash) => {
//   if (!IsModelInCdimage(modelHash)) return;

//   RequestModel(modelHash);
//   while (!HasModelLoaded(modelHash)) {
//     await Delay(100);
//   }
//   SetPlayerModel(PlayerId(), modelHash);
//   SetPedDefaultComponentVariation(PlayerPedId());
// }

// on('onClientGameTypeStart', () => {
//   exports.spawnmanager.setAutoSpawnCallback(() => {
//     exports.spawnmanager.spawnPlayer({
//       x: currentFrak.coords.playerspawn[0].coords[0],
//       y: currentFrak.coords.playerspawn[0].coords[1],
//       z: currentFrak.coords.playerspawn[0].coords[2],
//       model: 'mp_m_freemode_01'
//     }, () => {
//       // setPlayerModelSafe("mp_m_freemode_01")
//       SetPedDefaultComponentVariation(PlayerPedId());
//       if (currentFrak.outfits == null) return;
//       setClothing({
//         clothing: currentFrak.outfits,
//         shirt: currentFrak.outfits.body.shirt[0][0]
//       })
//       frakNUIended()
//     })
//   });
//   exports.spawnmanager.forceRespawn()
//   startUp()
// });

RegisterCommand('wehrestart', (source, args, raw) => {
  emitNet('sowehrestart')
}, false);