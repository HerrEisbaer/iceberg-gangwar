var socials = false;
RegisterCommand('socials', (source, args, raw) => {
    if (socials) {
        socials = false;
        SendNuiMessage(JSON.stringify({
            type: 'hideSocials'
        }))
        SetNuiFocus(false, false);
    } else {
        socials = true;
        SendNuiMessage(JSON.stringify({
            type: 'showSocials'
        }))
        SetNuiFocus(true, true);
    }
}, false);

RegisterNuiCallbackType('leavesocials')

on('__cfx_nui:leavesocials', (data, cb) => {
    SendNuiMessage(JSON.stringify({
        type: 'hideSocials'
    }))
    SetNuiFocus(false, false);
    socials = false;
})

const playerTags = {}

RegisterCommand('hideplayertags', (source, args, raw) => {
    emitNet('hidegamertags');
}, false);

RegisterCommand('showplayertags', (source, args, raw) => {
    TriggerServerCallback('cbAllValidFriends', (data) => {
        data.friends.forEach(friend => {
            TriggerServerCallback('getFrakOfIdentifier', (playersfrak) => {
                // console.log(playersfrak);
            }, friend.fivem)
            var result = data.allOnline.filter(obj => {
                return obj.identifiers[1].split(":")[1] === friend.fivem
            }) || null;
            if (result[0] == null) return;
            const playerId = GetPlayerFromServerId(result[0].id)
            const playerPed = GetPlayerPed(playerId)
            playerTags[playerId] = CreateFakeMpGamerTag(playerPed, `${GetPlayerName(playerId)} [${result[0].id}]`, 0, 0, "", 0)
            SetMpGamerTagVisibility(playerTags[playerId], 2, 1)
            SetMpGamerTagAlpha(playerTags[playerId], 2, 255)
            SetMpGamerTagHealthBarColor(playerTags[playerId], 129)
        })
    })
}, false);

on('firehidegamertags', () => {
    emitNet('hidegamertags');
})

on('fireshowplayertags', () => {
    TriggerServerCallback('cbAllValidFriends', (data) => {
        data.friends.forEach(friend => {
            TriggerServerCallback('getFrakOfIdentifier', (isSameFrak) => {
                if (isSameFrak) {
                    var result = data.allOnline.filter(obj => {
                        return obj.identifiers[1].split(":")[1] === friend.fivem
                    }) || null;
                    if (result[0] == null) return;
                    const playerId = GetPlayerFromServerId(result[0].id)
                    const playerPed = GetPlayerPed(playerId)
                    playerTags[playerId] = CreateFakeMpGamerTag(playerPed, `${GetPlayerName(playerId)} [${result[0].id}]`, 0, 0, "", 0)
                    SetMpGamerTagVisibility(playerTags[playerId], 2, 1)
                    SetMpGamerTagAlpha(playerTags[playerId], 2, 255)
                    SetMpGamerTagHealthBarColor(playerTags[playerId], 129)
                }
            }, friend.fivem)
        })
    })
})

onNet('showplayertags', (player) => {
    const playerId = GetPlayerFromServerId(player.id)
    const playerPed = GetPlayerPed(playerId)
    playerTags[playerId] = CreateFakeMpGamerTag(playerPed, GetPlayerName(playerId), 0, 0, "", 0)
    SetMpGamerTagVisibility(playerTags[playerId], 2, 1)
    SetMpGamerTagAlpha(playerTags[playerId], 2, 255)
    SetMpGamerTagHealthBarColor(playerTags[playerId], 129)
})

onNet('hideplayertags', (player) => {
    const playerId = GetPlayerFromServerId(player.id)
    if (playerTags[playerId] != null) RemoveMpGamerTag(playerTags[playerId]);
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