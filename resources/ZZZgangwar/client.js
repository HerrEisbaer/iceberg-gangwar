var loggedin = false

const spawnPos = [686.245, 577.950, 130.461];
on('onClientGameTypeStart', () => {
  exports.spawnmanager.setAutoSpawnCallback(() => {
    exports.spawnmanager.spawnPlayer({
      x: spawnPos[0],
      y: spawnPos[1],
      z: spawnPos[2],
      model: 'mp_m_freemode_01'
    }, () => {
        SetPedDefaultComponentVariation(PlayerPedId());
        if (loggedin) {
          updateHUD()
          if (currentFrak.coords.playerspawn != null) {
            SetEntityCoords(PlayerPedId(), currentFrak.coords.playerspawn[0], currentFrak.coords.playerspawn[1], currentFrak.coords.playerspawn[2], true, true, false, false);
            openMainMenu()
          }
        } else {
          openLoginNUI()
        }
    });
  });

  // Enable auto-spawn.
  exports.spawnmanager.setAutoSpawn(true)

  // And force respawn when the game type starts.
  exports.spawnmanager.forceRespawn()
});

onNet('loginCompletet', (data) => {
  if (data.loggedin) {
    closeLoginNUI()
    openMainMenu()
    loggedin = true
  } else {
    addNotify("Fehler", `Konnte nicht eingeloggt werden. Grund: ${data.error}`)
  }
})

RegisterNuiCallbackType('postInputdata')

on('__cfx_nui:postInputdata', (data, cb) => {
    emitNet('logUserIn', data, PlayerPedId())
    cb(true)
})

/*
* OpenNUI Funktionen
*/

//Login UI
function openLoginNUI() {
  SetNuiFocus(true, true);    
  SendNuiMessage(JSON.stringify({
      type: 'openLogin'
  }))
}

function closeLoginNUI() {
  SetNuiFocus(false, false);
  SendNuiMessage(JSON.stringify({
      type: 'closeLogin'
  }))
}

//Mainmenu

RegisterNuiCallbackType('getAlleFraks')

on('__cfx_nui:getAlleFraks', (data, cb) => {
  emitNet("getAllFraks")
  onNet("gettetAllFraks", (fraks) => {
    cb(fraks)
  })
})

RegisterCommand('team', (source, args, raw) => {
  openMainMenu()
}, false);

function openMainMenu() {
  SetNuiFocus(true, true);    
  SendNuiMessage(JSON.stringify({
      type: 'openMainMenu',
  }))
}

RegisterCommand('leaveMainMenu', (source, args, raw) => {
  closeMainMenu()
}, false);


RegisterNuiCallbackType('getOutifts')

on('__cfx_nui:getOutifts', (data, cb) => {
  emitNet('getOutfits')
  onNet('postOutfits', outifts => {
    cb(outifts)
  })
})

//Frak Vars

const carcolors = {
  bloods: {
    primaryColor: 27,
    secondaryColor: 27
  },
  grove: {
    primaryColor: 49,
    secondaryColor: 49
  },
  lcn: {
    primaryColor: 0,
    secondaryColor: 0
  },
  mg13: {
    primaryColor: 74,
    secondaryColor: 74
  },
  police: {
    primaryColor: 64,
    secondaryColor: 64
  },
  triaden: {
    primaryColor: 70,
    secondaryColor: 70
  },
  vagos: {
    primaryColor: 88,
    secondaryColor: 88
  },
}

var currentFrak = null

RegisterNuiCallbackType('postFrakData')

on('__cfx_nui:postFrakData', (data, cb) => {
    if (data.frak == null) {
      addNotify("Fehler", "Irgendetwas ist schiefgelaufen und du hast keine Fraktion ausgewählt. Versuche es erneut.")
      cb(false)
      return
    }
    if (data.outfit == null) {
      addNotify("Fehler", "Du musst zunächst ein Outfit auswählen.")
      cb(false)
      return
    }
    if (data.car == null) {
      addNotify("Fehler", "Irgendwas ist schiefgelaufen und das Auto, was du spawnen möchtest wurde nicht erkannt.")
      cb(false)
      return
    }
    emitNet("getFrak", data.frak)
    onNet('setFrak', frak => {
      currentFrak = frak[0]._doc
      cb(true)
      currentFrak.coords.playerspawn = stringToArray(currentFrak.coords.playerspawn, ",")
      currentFrak.coords.carspawns = stringToArray(currentFrak.coords.carspawns, ",")
      console.log(currentFrak.coords.playerspawn);
      console.log(currentFrak.coords.carspawns);
      closeMainMenu()
      spawnFrak(data.car.toLowerCase())
      showHud()
    })
})

function spawnFrak(car) {
  SetEntityCoords(PlayerPedId(), currentFrak.coords.playerspawn[0], currentFrak.coords.playerspawn[1], currentFrak.coords.playerspawn[2], true, true, false, false);
  addNotify("Iceberg Gangwar", "Dein Fahrzeug wurde gespawnt. Viel Spaß.")
  if (car) {
    spawnCarAtFrak(car)
  }
}

var currentCar = null

function spawnCarAtFrak(car) {
  const hash = GetHashKey(car)
  if (!IsModelInCdimage(hash)) return
  RequestModel(hash)
  if (currentCar != null) {
    DeleteEntity(currentCar)
  }
  currentCar = CreateVehicle(hash, currentFrak.coords.carspawns[0], currentFrak.coords.carspawns[1], currentFrak.coords.carspawns[2], 0);
  SetVehicleColours(currentCar, carcolors[currentFrak.name].primaryColor, carcolors[currentFrak.name].secondaryColor)
  SetPedIntoVehicle(PlayerPedId(), currentCar, -1)
}

function stringToArray(string, sep) {
  const wehstring = string.toString()
  console.log("suiii", wehstring);
  const array = []
  wehstring[0].replace("[", "").replace("]", "").replace(" ", "").split(sep).forEach(coord => {
    array.push(parseInt(coord))
  })
  return array
}

RegisterNuiCallbackType('addNotify')

on('__cfx_nui:addNotify', (data, cb) => {
  addNotify(data.title, data.text)
})

function addNotify(title, text) {
  SendNuiMessage(JSON.stringify({
    type: 'addnotify',
    title: title,
    text: text
  }))
}

function closeMainMenu() {
  SetNuiFocus(false, false);    
  SendNuiMessage(JSON.stringify({
      type: 'closeMainMenu'
  }))
}

//HUD

function showHud() {
  SendNuiMessage(JSON.stringify({
    type: 'showHUD'
  }))
}

function hideHud() {
  SendNuiMessage(JSON.stringify({
    type: 'hideHUD'
  }))
}

function updateHUD() {
  SendNuiMessage(JSON.stringify({
    type: 'updateHUD'
  }))
}

on('__cfx_nui:getAlleFraks', (data, cb) => {
  emitNet("getAllFraks")
  onNet("gettetAllFraks", (fraks) => {
    cb(fraks)
  })
})

RegisterNuiCallbackType('getPlayerStats')

on('__cfx_nui:getPlayerStats', (data, cb) => {
  emitNet('getStatsOfPlayer')
  onNet('postPlayerData', cb)
})

// Debug

RegisterCommand('openNUI', (source, args, raw) => {
  openLoginNUI()
}, false);

//Frakcreator

RegisterCommand('frakcreator', (source, args, raw) => {
  SetNuiFocus(true, true);    
  SendNuiMessage(JSON.stringify({
      type: 'openFrakcreator'
  }))
}, false);

function closeFrakcreator() {
  SetNuiFocus(false, false);    
  SendNuiMessage(JSON.stringify({
      type: 'closeFrakcreator'
  }))
}

RegisterNuiCallbackType('createFrak')

on('__cfx_nui:createFrak', (data, cb) => {
  console.log(data);
  emitNet('createFrak', data)
  closeFrakcreator()
})

//OnDeath, etc.

on('baseevents:onPlayerDied', (type, coords) => {
  console.log(`woah u just died at ${coords} by ${type}`);
})

on('baseevents:onPlayerKilled', (killerID, deathData) => {
  console.log("no way u just died, anyways: ",killerID, deathData);
})