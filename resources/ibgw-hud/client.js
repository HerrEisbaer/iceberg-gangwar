on('showHUD', () => {
    SendNuiMessage(JSON.stringify({
        type: 'showHUD'
    }))
    return;
})

on('hideHUD', () => {
    SendNuiMessage(JSON.stringify({
        type: 'hideHUD'
    }))
    return;
})

// on('addNotify', (title, text) => {
//     SendNuiMessage(JSON.stringify({
//         type: 'addNotify',
//         title: title,
//         text: text
//     }))
//     return;
// })


RegisterNuiCallbackType('addNotify')

on('__cfx_nui:addNotify', (data, cb) => {
    SendNuiMessage(JSON.stringify({
        type: 'addNotify',
        title: data.title,
        text: data.text
    }))
    cb(true);
})

onNet('addNotify', (title, text) => {
    SendNuiMessage(JSON.stringify({
        type: 'addNotify',
        title: title,
        text: text
    }))
    return;
})

onNet('addAlert', (title, text) => {
    SendNuiMessage(JSON.stringify({
        type: 'addAlert',
        title: title,
        text: text
    }))
    return;
})

on('progressbar', title => {
    SendNuiMessage(JSON.stringify({
        type: 'progresbar',
        title: title
    }))
    return;
})

on('progressbarabbr', () => {
    SendNuiMessage(JSON.stringify({
        type: 'prgbarabbr'
    }))
    return;
})

on('updateweapon', weapon => {
    console.log("slakjbsd", weapon);
    SendNuiMessage(JSON.stringify({
        type: 'updateweapon',
        weapon: weapon
    }))
    return;
})