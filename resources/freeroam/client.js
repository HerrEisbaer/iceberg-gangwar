var loggedin = false;

var freeroam = true;

var currentFrak = {
  coords: {
    playerspawn: [{heading: 0, coords: [686.245, 577.950, 130.461]}]
  }
}

const Delay = (ms) => new Promise((res) => setTimeout(res, ms));

on('openFrakWahl', () => {
  switchFrakmenu(true)
  return;
})

//Frakmenu

function switchFrakmenu(action) {
  emit('firehidegamertags');
  switch (action) {
    case true:
      SetNuiFocus(true, true);
      SendNuiMessage(JSON.stringify({
          type: 'openFrakmenu'
      }))
      break;
    case false:
      SetNuiFocus(false, false);
      SendNuiMessage(JSON.stringify({
          type: 'closeFrakmenu'
      }))
      break
    default:
      console.log("wtf hier ist falsch falschgelaufen:", action);
      break;
  }
}

RegisterNuiCallbackType('getUserStats')

on('__cfx_nui:getUserStats', (data, cb) => {
    emitNet('sendUserstats')
    onNet('cbUserstats', cb)
    return
})

RegisterNuiCallbackType('openedClothing')

on('__cfx_nui:openedClothing', (data, cb) => {
  SetGameplayCamRelativeHeading(180);
  SetGameplayCamRawYaw(0);
  SetGameplayCamRelativePitch(0, 1.0);
  SetCamFov(GetRenderingCam(), 130);
  FreezePedCameraRotation(PlayerPedId());
  DisplayRadar(false);
  return;
})

RegisterNuiCallbackType('setDefaultClothingOfFrak')

on('__cfx_nui:setDefaultClothingOfFrak', (data, cb) => {
  setClothing(data)
  currentFrak.outfits = data.clothing
  cb(true)
  return;
})

function setClothing(data) {
  const clothing = data.clothing;
  SetPedComponentVariation(PlayerPedId(), 3, clothing.body.torso[0][2], 0, GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.body.torso[0][2]))
  SetPedComponentVariation(PlayerPedId(), 8, data.shirt, 0, GetNumberOfPedDrawableVariations(PlayerPedId(), data.shirt))
  SetPedComponentVariation(PlayerPedId(), 11, clothing.body.torso[0][0], clothing.body.torso[0][1], GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.body.torso[0][0]))
  SetPedComponentVariation(PlayerPedId(), 4, clothing.legs.pants[0][0], clothing.legs.pants[0][1], GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.legs.pants[0][0]))
  SetPedComponentVariation(PlayerPedId(), 6, clothing.feet.shoes[0][0], clothing.feet.shoes[0][1], GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.feet.shoes[0][0]))
  SetPedComponentVariation(PlayerPedId(), 1, clothing.head.mask[0][0], clothing.head.mask[0][1], GetNumberOfPedDrawableVariations(PlayerPedId(), clothing.head.mask[0][0]))
}

const clothingids = {
  hat: 0,
  mask: 1,
  shirt: 8,
  torso: 11,
  pants: 4,
  shoes: 6
}

RegisterNuiCallbackType('setClothing')

on('__cfx_nui:setClothing', (data, cb) => {
  const cloth = data.clothing;
  SetPedComponentVariation(PlayerPedId(), clothingids[data.type], cloth.index.clothing, cloth.index.variation, GetNumberOfPedDrawableVariations(PlayerPedId(), cloth.index.clothing))
  if (data.arms != null) SetPedComponentVariation(PlayerPedId(), 3, data.arms, 0, GetNumberOfPedDrawableVariations(PlayerPedId(), data.arms))
  if (data.shirt != null) SetPedComponentVariation(PlayerPedId(), 8, data.shirt, 0, GetNumberOfPedDrawableVariations(PlayerPedId(), data.shirt))
  return;
})

var peds = [];

const spawnNPCs = async (modelHash) => {
  if (currentFrak == null) return;
  RequestModel(modelHash);
  while (!HasModelLoaded(modelHash)) {
    await Delay(100);
  }
  peds.forEach(ped => {
    DeletePed(ped);
  })
  currentFrak.coords.carspawner.forEach(npc => {
    const ped = CreatePed(4, modelHash, npc.coords[0], npc.coords[1], npc.coords[2] - 1, npc.heading, false, true)
    FreezeEntityPosition(ped, true)
    SetEntityInvincible(ped, true)
    SetBlockingOfNonTemporaryEvents(ped, true)
    peds.push(ped)
  })
}

var istamwesteziehen = false;
var istammedkitziehen = false;
var istamrepen = false;
var repenabg = false;

setInterval(() => {
  StatSetInt(GetHashKey("MP0_STAMINA"), 100, true)
  DisableControlAction(0, 140, true)
  if (currentFrak == null) return;
  if (IsControlJustReleased(0, 38) || IsControlJustReleased(0, 45)) {
    currentFrak.coords.carspawner.forEach(coord => {
      const playercoords = GetEntityCoords(PlayerPedId())
      const dist = GetDistanceBetweenCoords(playercoords[0], playercoords[1], playercoords[2], coord.coords[0], coord.coords[1], coord.coords[2] - 1, true)
      if (dist <= 1.5) {
        if (IsControlJustReleased(0, 45)) {
          console.log("respawn last vehicle");
        } else {
          SetNuiFocus(true, true);
          SendNuiMessage(JSON.stringify({ type: 'openCar' }))
          SendNuiMessage(JSON.stringify({ type: 'hideHUD' }))
        }
      }
    })
  }
  if (freeroam) {
    if (IsControlJustReleased(0, 81)) {
      if (istamwesteziehen || istammedkitziehen || istamrepen) return;
      if (IsPedInAnyVehicle(PlayerPedId())) return;
      if (GetEntityHeightAboveGround(PlayerPedId()) > 1.1) return;
      istamwesteziehen = true;
      westeziehen();
      emit('progressbar', "Weste ziehen");
    }
    if (IsControlJustReleased(0, 82)) {
      if (istamwesteziehen || istammedkitziehen || istamrepen) return;
      if (IsPedInAnyVehicle(PlayerPedId())) return;
      console.log(GetEntityHeightAboveGround(PlayerPedId()));
      if (GetEntityHeightAboveGround(PlayerPedId()) > 1.1) return;
      istammedkitziehen = true;
      medkitziehen();
      emit('progressbar', "Medkit ziehen");
    }
    if (IsControlJustReleased(0, 170)) {
      if (istamwesteziehen || istammedkitziehen || istamrepen) return;
      if (!IsPedInAnyVehicle(PlayerPedId())) return;
      if (GetEntitySpeed(GetVehiclePedIsIn(PlayerPedId())) > 1) return;
      istamrepen = true;
      carrepen();
      emit('progressbar', "Fahrzeug reparieren")
    }
    if (IsControlJustReleased(0, 38) && (istamwesteziehen || istammedkitziehen || istamrepen)) {
      if (!istamrepen) ClearPedTasksImmediately(PlayerPedId());
      emit('progressbarabbr');
      if (istamwesteziehen) {
        istamwesteziehen = false;
        emit('addNotify', "Weste", "Weste abgebrochen");
      };
      if (istammedkitziehen) {
        istammedkitziehen = false;
        emit('addNotify', "Medkit", "Medkit abgebrochen");
      };
      if (istamrepen) {
        istamrepen = false;
        repenabg = true;
        emit('addNotify', "Fahrzeug", "Fahrzeug Reperatur abgebrochen");
      };
    }
    if (istamwesteziehen || istammedkitziehen || istamrepen) {
      DisableControlAction(0, 140, true);
      DisableControlAction(0, 74, true);
      DisableControlAction(0, 2, true); 
      DisableControlAction(0, 263, true); 
      DisableControlAction(0, 45, true); 
      DisableControlAction(0, 22, true); 
      DisableControlAction(0, 44, true); 
      DisableControlAction(0, 37, true); 
      DisableControlAction(0, 288,  true); 
      DisableControlAction(0, 289, true); 
      DisableControlAction(0, 170, true); 
      DisableControlAction(0, 167, true); 
      DisableControlAction(1, 254, true);
      DisableControlAction(0, 47, true);  
    }
    if (repenabg) {
      FreezeEntityPosition(GetVehiclePedIsIn(PlayerPedId()), false);
      repenabg = true;
    }
  }
}, 1);

// function loadAnimDict(dict)
// 	while (not HasAnimDictLoaded(dict)) do
// 		RequestAnimDict(dict)
// 		Citizen.Wait(5)
// 	end

async function loadAnimDict(dict) {
  while (!HasAnimDictLoaded(dict)) {
    RequestAnimDict(dict)
    await Delay(100)
  }
}

async function westeziehen() {
  const playerPed = PlayerPedId()
  const dict = "anim@heists@narcotics@funding@gang_idle";
  while (!HasAnimDictLoaded(dict)) {
    RequestAnimDict(dict)
    await Delay(100)
  }
  TaskPlayAnim(playerPed, "anim@heists@narcotics@funding@gang_idle" ,"gang_chatting_idle01", 8.0, -8.0, -1, 0, 0, false, false, false)
  await Delay(3500)
  if (!istamwesteziehen) return;
  ClearPedTasksImmediately(playerPed)
  SetPedArmour(playerPed, 100);
  istamwesteziehen = false;
  emit('addNotify', "Weste", "Weste gezogen")
}

async function medkitziehen() {
  const playerPed = PlayerPedId()
  const dict = "anim@heists@narcotics@funding@gang_idle";
  while (!HasAnimDictLoaded(dict)) {
    RequestAnimDict(dict)
    await Delay(100)
  }
  TaskPlayAnim(playerPed, "anim@heists@narcotics@funding@gang_idle" ,"gang_chatting_idle01", 8.0, -8.0, -1, 0, 0, false, false, false);
  await Delay(3500);
  if (!istammedkitziehen) return;
  ClearPedTasksImmediately(playerPed);
  SetEntityHealth(playerPed, GetEntityMaxHealth(playerPed));
  istammedkitziehen = false;
  emit('addNotify', "Medkit", "Medkit gezogen")
}

async function carrepen() {
  const playerPed = PlayerPedId();
  const car = GetVehiclePedIsIn(playerPed);
  FreezeEntityPosition(car, true);
  await Delay(3500);
  FreezeEntityPosition(car, false);
  SetVehicleEngineHealth(car, 1000);
  SetVehicleEngineOn(car, true, true);
  SetVehicleFixed(car);
  if (!istamrepen) return;
  istamrepen = false;
  emit('addNotify', "Fahrzeug", "Fahrzeug repariert")
}

RegisterNuiCallbackType('spawnCar')

on('__cfx_nui:spawnCar', (data, cb) => {
  console.log("hehe");
  if (data == null) {
    SetNuiFocus(false, false);
    SendNuiMessage(JSON.stringify({ type: 'showHUD' }))
    // emit('showHUD')
    return
  }
  if (data.car.level <= data.stats.level.level) {
    var found = false;
    for (let i = 0; i < currentFrak.coords.carspawns.length; i++) {
      if (found) return;
      const spawn = currentFrak.coords.carspawns[i];
      if (!checkForCar(spawn.coords, 3)) {
        found = true;
        spawnCarAtFrak(data.car.spawnname, spawn.coords, spawn.heading)
        SetNuiFocus(false, false);
        SendNuiMessage(JSON.stringify({ type: 'showHUD' }))
        // emit('showHUD')
        cb(true)
        return
      }
    }
    if (!found) {
      SendNuiMessage(JSON.stringify({
        type: 'addNotify',
        title: "Fahrzeugauswahl",
        text: "Alle Spawnpunkte sind belegt."
      }))
      // emit('addNotify', "Fahrzeugauswahl", "Alle Spawnpunkte sind belegt.")
      cb(false)
      return
    }
  } else {
    SendNuiMessage(JSON.stringify({
        type: 'addNotify',
        title: "Fahrzeugauswahl",
        text: "Dein Level ist zu niedrig!"
    }))
    // emit('addNotify', "Fahrzeugauswahl", "Dein Level ist zu niedrig!")
    cb(false)
  }
  return;
})

var currentCar = null;

async function spawnCarAtFrak(car, spawn, heading) {
  const hash = GetHashKey(car)
  if (!IsModelInCdimage(hash)) return
  RequestModel(hash)
  while (!HasModelLoaded(hash)) {
    await Delay(100);
  }
  if (currentCar != null) {
    DeleteEntity(currentCar)
  }
  currentCar = CreateVehicle(hash, spawn[0], spawn[1], spawn[2], heading);
  // SetVehicleColours(currentCar, currentFrak.car.primaryColor, currentFrak.car.secondaryColor)
  SetVehicleCustomPrimaryColour(currentCar, currentFrak.car.primaryColor[0], currentFrak.car.primaryColor[1], currentFrak.car.primaryColor[2])
  SetVehicleCustomSecondaryColour(currentCar, currentFrak.car.secondaryColor[0], currentFrak.car.secondaryColor[1], currentFrak.car.secondaryColor[2]);
  // SetVehicleMod(currentCar, 13, 2);
  // SetVehicleMod(currentCar, 15, 3);
  // SetVehicleMod(currentCar, 11, 2);
  // SetVehicleMod(currentCar, 12, 2);
  SetPedIntoVehicle(PlayerPedId(), currentCar, -1)
}

function checkForCar(coords, range) {
  return IsPositionOccupied(coords[0], coords[1], coords[2], range, false, true, false);
}

RegisterNuiCallbackType('leaveFrakNUI')

on('__cfx_nui:leaveFrakNUI', (data, cb) => {
  currentFrak = data.frak;
  freeroam = true;
  SetEntityCoords(PlayerPedId(), currentFrak.coords.playerspawn[0].coords[0], currentFrak.coords.playerspawn[0].coords[1], currentFrak.coords.playerspawn[0].coords[2], true, true, false, false);
  SetEntityHeading(PlayerPedId(), currentFrak.coords.playerspawn[0].heading)
  spawnNPCs(GetHashKey("s_m_m_gardener_01"))
  FreezeEntityPosition(PlayerPedId(), false);
  SetPedArmour(PlayerPedId(), 100);
  DisplayRadar(true);
  SetNuiFocus(false, false);
  emit('showHUD')
  emit('giveweapons')
  emit('fireshowplayertags');
  emitNet('sobisschenfrakdingens', currentFrak.name)
  cb(true)
  return;
})



// function frakNUIended() {
//   SetEntityCoords(PlayerPedId(), currentFrak.coords.playerspawn[0].coords[0], currentFrak.coords.playerspawn[0].coords[1], currentFrak.coords.playerspawn[0].coords[2], true, true, false, false);
//   SetEntityHeading(PlayerPedId(), currentFrak.coords.playerspawn[0].heading)
//   spawnNPCs(GetHashKey("s_m_m_gardener_01"))
//   SetPedArmour(PlayerPedId(), 100);
//   FreezeEntityPosition(PlayerPedId(), false);
//   emit('showHUD')
//   emit('giveweapons')
//   return;
// }

// function GiveWeaponsToPlayer() {
//   GiveWeaponToPed(PlayerPedId(), 'weapon_advancedrifle', 999, false, false);
//   GiveWeaponToPed(PlayerPedId(), 'weapon_heavypistol', 999, false, false);
//   SetPedInfiniteAmmo(PlayerPedId(), true, 'weapon_advancedrifle');
//   SetPedInfiniteAmmo(PlayerPedId(), true, 'weapon_heavypistol');
// }

RegisterCommand('unfreeze', (source, args, raw) => {
    FreezeEntityPosition(PlayerPedId(), false);
}, false);

RegisterNuiCallbackType('createFrak')

on('__cfx_nui:createFrak', (data, cb) => {
  console.log(data.frak);
  emitNet("saveFrak", data.frak)
  SetNuiFocus(false, false)
  return;
})

RegisterCommand('frakcreator', (source, args, raw) => {
  SendNuiMessage(JSON.stringify({
      type: 'openFrakcreator'
  }))
  SetNuiFocus(true, true)
}, false);

RegisterCommand('setCloth', (source, args, raw) => {
  SetPedComponentVariation(PlayerPedId(), parseInt(args[0]), parseInt(args[1]), parseInt(args[2]), parseInt(args[0]))
}, false);

RegisterCommand('getCloth', (source, args, raw) => {
  console.log(GetPedDrawableVariation(PlayerPedId(), parseInt(args[0])), GetNumberOfPedDrawableVariations(PlayerPedId(),  parseInt(args[0])));
}, false);

var clothing = false;

RegisterCommand('testClothing', (source, args, raw) => {
  if (clothing) {
    clothing = false
    SendNuiMessage(JSON.stringify({
        type: 'closetestclothing'
    }))
    SetNuiFocus(false, false)
  } else {
    SendNuiMessage(JSON.stringify({
      type: 'testclothing'
    }))
    SetNuiFocus(true, true)
    clothing = true;
  }
  SetPedComponentVariation(PlayerPedId(), 11, 127, 1, GetPedPaletteVariation(PlayerPedId(), 111))
  SetPedComponentVariation(PlayerPedId(), 4, 24, 0, GetPedPaletteVariation(PlayerPedId(), 111))
}, false);

// RegisterNuiCallbackType('setTestClothing')

// on('__cfx_nui:setTestClothing', (data, cb) => {
//   console.log(data.indexes);
//   SetPedComponentVariation(PlayerPedId(), 8, data.indexes.clothing, data.indexes.variation, GetPedPaletteVariation(PlayerPedId(), data.indexes.clothing))
// })

RegisterCommand('team', (source, args, raw) => {
  switchFrakmenu(true)
  if (currentCar != null) {
    DeleteEntity(currentCar)
  }
}, false);

// on('baseevents:onPlayerKilled', (killerID, deathData) => {
//   console.log(killerID, deathData);
// })

RegisterCommand('war', (source, args, raw) => {
  if (args.length < 2) {
    emit('addNotify', "System", "Zu wenig Argumente übermittelt");
    return;
  }
  if (args[0].toLowerCase() === args[1].toLowerCase()) {
    emit('addNotify', "System", "Das ergibt keinen Sinn");
    return;
  }
  TriggerServerCallback('getIfPlayerIsAdmin', (isAdmin) => {
    if (isAdmin) {
      emitNet('setKrieg', args[0].toLowerCase(), args[1].toLowerCase())
    } else {
      emit('addNotify', "System", "Dafür hast du keine Rechte.");
    }
    return;
  })
  return;
}, false);

function TriggerServerCallback(name, cbFunction, ...args) {
  const lol = GetPlayerServerId(PlayerId())
  const event = (data) => {
    cbFunction(data);
    removeEventListener(`boergie__cb__response_${name}_${lol}`, event);
  }
  onNet(`boergie__cb__response_${name}_${lol}`, event)
  emitNet(`boergie__cb_${name}`, args, "|")
}

// onNet(`boergie__cb__response_getIfPlayerIsAdmin_1`, (data) => {
//   console.log("kam zurück2", data);
// })

onNet('addnotifylol', (title, text) => emit('addNotify', title, text));