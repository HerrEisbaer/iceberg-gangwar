var loggedin = false;

const Delay = (ms) => new Promise((res) => setTimeout(res, ms));

on('openLogin', () => {
    SetNuiFocus(true, true);
    SendNuiMessage(JSON.stringify({
        type: 'openLogin'
    }))
})

RegisterCommand('login', (source, args, raw) => {
    SetNuiFocus(true, true);
    SendNuiMessage(JSON.stringify({
        type: 'openLogin'
    }))
}, false);

RegisterNuiCallbackType('postLoginData')

on('__cfx_nui:postLoginData', (data, cb) => {
  emitNet('logUserIn', data)
  cb(true)
})

onNet('loginCompletet', (data) => {
    if (data.loggedin) {
        SetNuiFocus(false, false);
        SendNuiMessage(JSON.stringify({
            type: 'closeLogin'
        }))
        loggedin = true
        console.log("weh eingeloggt");
        emit('openFrakWahl')
        // closeLoginNUI()
        // switchFrakmenu(true)
    } else {
        console.log("Login fehlgeschlagen", data, data.error);
        // addNotify("Fehler", `Konnte nicht eingeloggt werden. Grund: ${data.error}`)
    }
})