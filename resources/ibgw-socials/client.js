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
    cb(true);
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

RegisterNuiCallbackType('partyDeletePlayerTags')

on('__cfx_nui:partyDeletePlayerTags', (data, cb) => {
    emitNet('hidepartytags', data);
    cb(true);
    emit('fireshowplayertags');
})

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

// Party

RegisterNuiCallbackType('createParty')

on('__cfx_nui:createParty', (data, cb) => {
    emitNet('createParty', data)
    cb(true)
})

on('partyfirehidegamertags', () => {
    emitNet('hidegamertags');
})

RegisterNuiCallbackType('showPartyTags')

on('__cfx_nui:showPartyTags', (data, cb) => {
    emit('partyfireshowplayertags');
    cb(true);
})

on('partyfireshowplayertags', () => {
    TriggerServerCallback('cbAllPartyMembers', (data) => {
        data.members.forEach(member => {
            TriggerServerCallback('getFrakOfIdentifier', (isSameFrak) => {
                if (isSameFrak) {
                    var result = data.allOnline.filter(obj => {
                        return obj.identifiers[1].split(":")[1] === member.fivem
                    }) || null;
                    if (result[0] == null) return;
                    const playerId = GetPlayerFromServerId(result[0].id)
                    const playerPed = GetPlayerPed(playerId)
                    playerTags[playerId] = CreateFakeMpGamerTag(playerPed, `${GetPlayerName(playerId)} [${result[0].id}]`, 0, 0, "", 0)
                    SetMpGamerTagVisibility(playerTags[playerId], 2, 1)
                    SetMpGamerTagAlpha(playerTags[playerId], 2, 255)
                    SetMpGamerTagHealthBarColor(playerTags[playerId], 21)
                }
            }, member.fivem)
        })
    })
})

const Delay = (ms) => new Promise((res) => setTimeout(res, ms));

RegisterNuiCallbackType('warptopartyowner')

on('__cfx_nui:warptopartyowner', (data, cb) => {
    TriggerServerCallback('getFrakNameOfIdentifier', async (fraks) => {
        if (fraks.other !== fraks.own) {
            emit("addNotify", "Party", "In 5 Sekunden wirst du in die Frak des Partyowners verschoben.");
            await Delay(5000);
            TriggerServerCallback('getAllFraks', (allFraks) => {
                let result = allFraks.find(frak => {
                    return frak.name === fraks.other
                }) || null;
                emit('__cfx_nui:leaveFrakNUI', {frak: result, donotcb: true});
            })
        }
    }, data.fivem)
    cb(true);
})

RegisterCommand('testPartyTags', (source, args, raw) => {
    emit("partyfireshowplayertags");
}, false);

RegisterCommand('lolrp', (source, args, raw) => {
    TriggerServerCallback("boergieFicktMütter", (rp) => {
        console.log(rp);
    });
}, false);

function TriggerServerCallback(name, cbFunction, ...args) {
    const lol = GetPlayerServerId(PlayerId())
    const event = (data) => {
      cbFunction(data);
      removeEventListener(`boergie__cb${GetCurrentResourceName()}__response_${name}_${lol}`, event);
    } 
    onNet(`boergie__cb${GetCurrentResourceName()}__response_${name}_${lol}`, event)
    emitNet(`boergie__cb${GetCurrentResourceName()}_${name}`, args, "|")
}

function TriggerNetServerCallback(name, cbFunction, ...args) {
    const lol = GetPlayerServerId(PlayerId())
    const event = (data) => {
      cbFunction(data);
      removeEventListener(`boergie__cb__response_${name}_${lol}`, event);
    }
    onNet(`boergie__cbnet__response_${name}_${lol}`, event)
    emitNet(`boergie__cb_${name}`, args)
}